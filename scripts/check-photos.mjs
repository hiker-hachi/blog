// 写真の見え方の点検。`npm run check` の中で check.mjs から呼ばれる。単体でも `node scripts/check-photos.mjs [distのフォルダ]` で走る。
//
// 2026-09-14 追加。9/7 のCSS変更で、文章と並べた写真がパソコンで幅100〜280pxに縮んだり、
// 高さ固定の縦写真が細長く切り抜かれたりしていたのに、1週間気づかなかった。
// ビルドした dist をヘッドレスChromeで開き、全記事の写真をパソコン・タブレット・スマホの幅で測る。
// サーバーは立てない（Chromeの通信を横取りして dist のファイルを返す）。外部への通信（アフィリ等）は全部止める。
import { spawn } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const WIDTHS = [1280, 768, 390];
const CHROME_PATHS = [
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
];
const HOST = 'http://photo-check.local';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };

// ページの中で測る。写真1枚ごとに [場所, 幅, 高さ, 形のずれ, 縮み, 横の文章の幅] を返す
const MEASURE = `(async () => {
	const all = [...document.querySelectorAll('.prose img')].filter((i) => !i.closest('.hero-image, .other-posts') && !/moshimo|msmaflink/.test(i.src + i.className + (i.closest('[id^=msmaflink], [class*=easyLink]') ? 'moshimo' : '')));
	all.forEach((i) => (i.loading = 'eager'));
	await Promise.all(all.map((i) => i.decode().catch(() => {})));
	await new Promise((r) => setTimeout(r, 150));
	const rows = [];
	for (const i of all) {
		const r = i.getBoundingClientRect();
		if (!r.width || !r.height || !i.naturalWidth || getComputedStyle(i).display === 'none') continue;
		const shape = r.width / r.height / (i.naturalWidth / i.naturalHeight);
		// 縮み：文章と並べた写真が、縮まなかった場合の幅に比べてどれだけ細くなったか
		let squeeze = 1, textW = null;
		const box = i.parentElement;
		const texts = [...box.children].filter((c) => c.tagName !== 'IMG');
		if (box.classList.contains('side-by-side') && texts.length && getComputedStyle(box).flexDirection === 'row') {
			textW = Math.min(...texts.map((t) => t.getBoundingClientRect().width));
			const prev = i.style.flexShrink;
			i.style.flexShrink = '0';
			const full = Math.min(i.getBoundingClientRect().width, box.getBoundingClientRect().width);
			i.style.flexShrink = prev;
			squeeze = r.width / full;
		}
		const name = decodeURIComponent((i.currentSrc || i.src).match(/href=([^&]+)/)?.[1] ?? i.src).split('/').pop().replace(/\\?.*$/, '');
		rows.push({ name, alt: (i.alt || '').slice(0, 20), w: Math.round(r.width), h: Math.round(r.height), shape: +shape.toFixed(2), squeeze: +squeeze.toFixed(2), textW: textW && Math.round(textW), grid: !!i.closest('.gear-grid') });
	}
	return { overflow: document.documentElement.scrollWidth - innerWidth, rows };
})()`;

export async function measurePhotos(dist = 'dist') {
	const chromePath = CHROME_PATHS.find((p) => existsSync(p));
	if (!chromePath) return { skipped: 'Chrome が見つからないので、写真の点検は飛ばしました' };
	const blogDir = join(dist, 'blog');
	const slugs = readdirSync(blogDir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && existsSync(join(blogDir, d.name, 'index.html')))
		.map((d) => d.name);

	const profile = mkdtempSync(join(tmpdir(), 'photo-check-'));
	const port = 9400 + Math.floor(Math.random() * 500);
	const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
	try {
		let targets;
		for (let t = 0; t < 50 && !targets; t++) {
			await new Promise((r) => setTimeout(r, 200));
			targets = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).catch(() => undefined);
		}
		const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
		await new Promise((r) => ws.addEventListener('open', r));
		let id = 0;
		const pending = new Map();
		let onLoad = null;
		const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
		ws.addEventListener('message', (e) => {
			const m = JSON.parse(e.data);
			if (pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
			if (m.method === 'Page.loadEventFired' && onLoad) onLoad();
			if (m.method === 'Fetch.requestPaused') {
				const u = new URL(m.params.request.url);
				if (u.origin !== HOST) return void send('Fetch.failRequest', { requestId: m.params.requestId, errorReason: 'BlockedByClient' });
				let p = join(dist, decodeURIComponent(u.pathname));
				if (p.endsWith('/')) p = join(p, 'index.html');
				if (!existsSync(p)) return void send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 404, body: '' });
				send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: TYPES[extname(p)] ?? 'application/octet-stream' }], body: readFileSync(p).toString('base64') });
			}
		});
		await send('Page.enable');
		await send('Runtime.enable');
		await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });

		const result = {};
		for (const width of WIDTHS) {
			await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 600 });
			for (const slug of slugs) {
				const loaded = new Promise((r) => { onLoad = r; setTimeout(r, 8000); });
				await send('Page.navigate', { url: `${HOST}/blog/${slug}/` });
				await loaded;
				const v = await send('Runtime.evaluate', { expression: MEASURE, awaitPromise: true, returnByValue: true });
				(result[slug] ??= {})[width] = v.result.value;
			}
		}
		ws.close();
		return { result };
	} finally {
		chrome.kill();
		setTimeout(() => rmSync(profile, { recursive: true, force: true }), 500);
	}
}

// 測った数値から、直したほうがいいものを拾う。
// しきい値は 2026-09-14 に「9/7〜9/13の崩れていた状態（41a7235）」と「直した後（de6f86f）」を
// 同じ方法で測って決めた。崩れていた状態では全部のしきい値に引っかかり、直した後は0件になる。
//   縮み（パソコン幅）  直した後の最悪 0.85 ／ 崩れていた状態 0.19〜（175枚が0.8未満）→ 0.7未満
//   文章横の写真の幅    直した後の最小 220px ／ 崩れていた状態 67〜164px → 180px未満
//   形のずれ            直した後の最悪 0.59 ／ 崩れていた状態 0.15〜（61枚が0.5未満）→ 0.5未満
//                       （.gear-grid は正方形に切り抜く作りなので数えない）
//   横の文章の幅        直した後の最小 261px → 200px未満
// 横はみ出しは、前からある20px（富士山の山行編・大船山の768px）を含めて「見ておいたほうがいい」に出す。
export function photoProblems(result) {
	const errors = [];
	const warns = [];
	const where = { 1280: 'パソコン', 768: 'タブレット', 390: 'スマホ' };
	for (const [slug, byWidth] of Object.entries(result)) {
		for (const [w, m] of Object.entries(byWidth)) {
			const at = `${slug}（${where[w]} ${w}px）`;
			const pick = (rows, fn) => rows.filter(fn);
			const list = (rows, show) => `${rows.length}枚（${rows.slice(0, 2).map(show).join('、')}${rows.length > 2 ? ' ほか' : ''}）`;
			const squeezed = pick(m.rows, (x) => x.textW != null && ((+w >= 1280 && x.squeeze < 0.7) || x.w < 180));
			if (squeezed.length) errors.push(`文章の横の写真が縮んでいる: ${at} → ${list(squeezed, (x) => `「${x.alt}」幅${x.w}px`)}`);
			const cropped = pick(m.rows, (x) => !x.grid && Math.min(x.shape, 1 / x.shape) < 0.5);
			if (cropped.length) errors.push(`写真が細長く（平たく）切り抜かれている: ${at} → ${list(cropped, (x) => `「${x.alt}」${x.w}×${x.h}`)}`);
			const narrow = pick(m.rows, (x) => x.textW != null && x.textW < 200);
			if (narrow.length) errors.push(`写真の横の文章が細すぎる: ${at} → ${list(narrow, (x) => `「${x.alt}」の横が${x.textW}px`)}`);
			if (m.overflow > 0) warns.push(`横にはみ出している: ${at} → ${m.overflow}px`);
		}
	}
	return { errors, warns };
}

// 単体で走らせたときは、見つかったものを出す。--json で測った数値をそのまま出す（しきい値を見直すとき用）
if (import.meta.url === `file://${process.argv[1]}`) {
	const args = process.argv.slice(2);
	const { skipped, result } = await measurePhotos(args.find((a) => !a.startsWith('--')) ?? 'dist');
	if (skipped) console.log(skipped);
	else if (args.includes('--json')) console.log(JSON.stringify(result));
	else {
		const { errors, warns } = photoProblems(result);
		for (const e of errors) console.log(`❌ ${e}`);
		for (const w of warns) console.log(`⚠️  ${w}`);
		if (!errors.length) console.log('✅ 写真の崩れは見つかりませんでした');
	}
}
