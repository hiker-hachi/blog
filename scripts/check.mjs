// サイトの点検スクリプト。`npm run check` で走る。
//
// 2026-09-07 の点検で見つかった不備を、次からは自動で拾えるようにしたもの。
// 見つけられるのは「ファイルを読めば分かること」だけ。実際の横スクロールや
// 記事の中身の正しさは、ブラウザと人の目でないと分からない。
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const errors = [];
const warns = [];
const info = [];

// ---------- 下ごしらえ ----------
function walk(dir, out = []) {
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, name.name);
		if (name.isDirectory()) walk(p, out);
		else out.push(p);
	}
	return out;
}
const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const size = (urlPath) => {
	const p = join(DIST, urlPath.replace(/^\//, '').split('?')[0]);
	return existsSync(p) ? statSync(p).size : null;
};
// 記事ページ（/blog/<slug>/index.html）だけ。/blog/ の一覧ページは含めない
const articleFiles = () => htmlFiles.filter((f) => /\/blog\/[^/]+\/index\.html$/.test(f));
const label = (f) => f.replace(`${DIST}/`, '').replace(/\/index\.html$/, '/').replace('index.html', '/');
const mb = (n) => (n / 1024 / 1024).toFixed(1);

// ---------- 1. OGP ----------
const needMeta = ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:image'];
for (const f of htmlFiles) {
	const h = readFileSync(f, 'utf8');
	const missing = needMeta.filter((m) => !h.includes(`"${m}"`));
	if (missing.length) errors.push(`OGPが欠けている: ${label(f)} → ${missing.join(', ')}`);
	const og = h.match(/property="og:image" content="([^"]+)"/);
	if (og) {
		const rel = og[1].replace(/^https?:\/\/[^/]+/, '');
		if (size(rel) === null) errors.push(`OGP画像が存在しない: ${label(f)} → ${og[1]}`);
	}
}

// ---------- 2. 最適化されていない画像 ----------
// public/ の画像を直に貼ると原寸のまま配信される（koyo.jpg が 11MB だった）
for (const f of htmlFiles) {
	const h = readFileSync(f, 'utf8');
	for (const tag of h.match(/<img[^>]*>/g) ?? []) {
		if (tag.includes('srcset')) continue;
		const src = tag.match(/src="(\/[^"]+\.(?:jpe?g|png))"/i);
		if (!src) continue;
		if (src[1].startsWith('/_astro/')) continue; // 単体で最適化済み
		const s = size(src[1]);
		if (s && s > 200 * 1024) {
			errors.push(`最適化されていない画像: ${label(f)} → ${src[1]} (${mb(s)}MB)`);
		}
	}
}

// ---------- 3. sizes が大きすぎないか ----------
// width を指定しないと元画像の幅で sizes が作られ、必要より大きい画像が選ばれる
for (const f of htmlFiles) {
	const h = readFileSync(f, 'utf8');
	const big = [...h.matchAll(/sizes="\(min-width: (\d+)px\)/g)].map((m) => +m[1]).filter((n) => n > 1000);
	if (big.length) warns.push(`sizes が大きい: ${label(f)} → ${[...new Set(big)].join(', ')}px が ${big.length}件`);
}

// ---------- 4. 参照切れ ----------
for (const f of htmlFiles) {
	const h = readFileSync(f, 'utf8');
	for (const m of h.matchAll(/(?:src|href)="(\/[^"?#]+\.[a-z0-9]{2,5})"/gi)) {
		if (size(m[1]) === null) errors.push(`ファイルが無い: ${label(f)} → ${m[1]}`);
	}
	for (const m of h.matchAll(/href="(\/[^"?#]*)"/g)) {
		const u = m[1];
		if (/\.[a-z0-9]{2,5}$/i.test(u)) continue;
		const p = join(DIST, u.replace(/^\//, ''));
		if (!existsSync(p) && !existsSync(join(p, 'index.html')) && !existsSync(`${p}.html`)) {
			errors.push(`リンク切れ: ${label(f)} → ${u}`);
		}
	}
}

// ---------- 5. PR表記 ----------
// もしものリンクがある記事には広告表記が要る（ステマ規制）
for (const f of articleFiles()) {
	const h = readFileSync(f, 'utf8');
	// SaleNotice のスクリプト内にも 'af.moshimo.com' という文字列が出てくるので、
	// 本物のリンク（アンカーのhref）とかんたんリンクの呼び出しだけを見る
	const hasAffiliate = h.includes('href="//af.moshimo.com') || h.includes('msmaflink({');
	const hasNotice = h.includes('アフィリエイト広告');
	if (hasAffiliate && !hasNotice) errors.push(`PR表記が無い: ${label(f)}`);
	if (!hasAffiliate && hasNotice) warns.push(`アフィリが無いのにPR表記がある: ${label(f)}`);
}

// ---------- 6. ページの配信量 ----------
// srcset からブラウザが選ぶものを再現して合計する
function pageWeight(f, viewport, dpr) {
	const h = readFileSync(f, 'utf8');
	let total = Buffer.byteLength(h);
	for (const m of h.matchAll(/href="(\/_astro\/[^"]+\.(?:css|woff2?))"/g)) total += size(m[1]) ?? 0;
	for (const tag of h.match(/<img[^>]*>/g) ?? []) {
		const ss = tag.match(/srcset="([^"]+)"/);
		if (ss) {
			const cands = ss[1]
				.split(',')
				.map((s) => s.trim().match(/(\S+)\s+(\d+)w/))
				.filter(Boolean)
				.map((m) => ({ w: +m[2], u: m[1] }))
				.sort((a, b) => a.w - b.w);
			const cap = +(tag.match(/sizes="\(min-width: (\d+)px\)/)?.[1] ?? cands.at(-1)?.w ?? viewport);
			const need = (viewport >= cap ? cap : viewport) * dpr;
			const pick = cands.find((c) => c.w >= need) ?? cands.at(-1);
			if (pick) total += size(pick.u) ?? 0;
			continue;
		}
		const src = tag.match(/src="(\/[^"]+)"/);
		if (src) total += size(src[1]) ?? 0;
	}
	return total;
}
const weights = htmlFiles
	.map((f) => ({ f, w: pageWeight(f, 390, 3) }))
	.sort((a, b) => b.w - a.w);
for (const { f, w } of weights) {
	if (w > 20 * 1024 * 1024) errors.push(`ページが重すぎる: ${label(f)} → ${mb(w)}MB`);
}
info.push(`重い順（スマホ・高精細で全部スクロールした場合）: ${weights.slice(0, 3).map(({ f, w }) => `${label(f)} ${mb(w)}MB`).join(' / ')}`);

// ---------- 7. public/ の未使用ファイル ----------
const referenced = new Set();
for (const f of htmlFiles) {
	const h = readFileSync(f, 'utf8');
	for (const m of h.matchAll(/(?:src|href|content)="(?:https?:\/\/[^/"]+)?(\/[^"?#]+\.[a-z0-9]{2,5})"/gi)) referenced.add(m[1]);
	for (const m of h.matchAll(/srcset="([^"]+)"/g)) for (const p of m[1].split(',')) referenced.add(p.trim().split(' ')[0]);
}
const publicFiles = existsSync('public') ? walk('public') : [];
let unusedBytes = 0;
const unused = [];
for (const p of publicFiles) {
	const url = `/${p.replace(/^public\//, '')}`;
	if (referenced.has(url)) continue;
	if (['/robots.txt', '/ads.txt', '/favicon.ico', '/favicon.svg'].includes(url)) continue;
	const s = statSync(p).size;
	unusedBytes += s;
	if (s > 100 * 1024) unused.push(`${url} (${mb(s)}MB)`);
}
if (unused.length) warns.push(`public/ に使われていないファイル（合計${mb(unusedBytes)}MB）: ${unused.join(', ')}`);

// ---------- 8. 説明（description）の字数 ----------
// 検索結果では120字あたりで切られる。短すぎると拾われる言葉が減る。
// 2026-09-09、ドラウトクアッドの説明が143字で後半が表示されない状態だった。
// 題の字数は見ない。ハチさんの題は長めが持ち味で、毎回警告しても意味がないため。
for (const f of articleFiles()) {
	const h = readFileSync(f, 'utf8');
	const d = h.match(/<meta name="description" content="([^"]*)"/);
	if (!d) continue;
	const n = [...d[1]].length;
	if (n > 125) errors.push(`説明が長い（${n}字・120字から先は検索結果に出ない）: ${label(f)}`);
	else if (n < 60) warns.push(`説明が短い（${n}字・拾われる言葉が少ない）: ${label(f)}`);
}

// ---------- 8. alt ----------
let noAlt = 0;
for (const f of articleFiles()) {
	const h = readFileSync(f, 'utf8');
	const hero = h.match(/<div class="hero-image[\s\S]*?<\/div>/)?.[0] ?? '';
	const other = h.match(/<div class="other-posts"[\s\S]*?<\/ul>/)?.[0] ?? '';
	for (const tag of h.match(/<img[^>]*>/g) ?? []) {
		if (/alt="[^"]+"/.test(tag)) continue;
		if (tag.includes('moshimo.com') || hero.includes(tag) || other.includes(tag)) continue;
		noAlt++;
	}
}
if (noAlt) warns.push(`本文の写真で説明（alt）が無いもの: ${noAlt}枚`);

// ---------- 出力 ----------
const line = '─'.repeat(64);
console.log(`\n${line}\n  サイト点検（${htmlFiles.length}ページ）\n${line}`);
if (errors.length) {
	console.log(`\n❌ 直したほうがいいもの（${errors.length}件）`);
	for (const e of errors.slice(0, 40)) console.log(`   ${e}`);
	if (errors.length > 40) console.log(`   ...ほか ${errors.length - 40}件`);
}
if (warns.length) {
	console.log(`\n⚠️  見ておいたほうがいいもの（${warns.length}件）`);
	for (const w of warns) console.log(`   ${w}`);
}
console.log('\nℹ️  参考');
for (const i of info) console.log(`   ${i}`);
if (!errors.length) console.log('\n✅ 自動で調べられる範囲では、直すところは見つかりませんでした');
console.log(`\n${line}`);
console.log('  ここでは分からないもの（人の目が要る）');
console.log('   ・実際の横スクロール（スマホで指で払う）');
console.log('   ・OGPの見え方（自分のLINEにURLを送る）');
console.log('   ・記事の中身、料金や施設情報が今も正しいか');
console.log('   ・アフィリリンクの商品が合っているか、売り切れていないか');
console.log(`${line}\n`);

process.exit(errors.length ? 1 : 0);
