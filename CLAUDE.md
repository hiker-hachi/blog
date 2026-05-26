# 一山一会 ブログ開発メモ

## サイト概要
- URL: https://ichizanichie.com
- フレームワーク: Astro
- ホスティング: Cloudflare Pages
- GitHubリポジトリ: hiker-hachi/blog

## 記事管理
- 記事ファイルの場所: src/content/blog/
- 画像の場所: src/assets/ または public/
- 投稿ペース: ブログ週1本、インスタ週2投稿

## 設定済みの機能
- SEO設定済み（BaseHead.astro）
- OGP設定済み（og:title / og:description / og:image / og:type / og:site_name / og:locale）
- OGP画像は getImage() で自動最適化（WebP・1200x630px・138KB程度）
- Google Search Console登録・サイトマップ送信済み
- 楽天アフィリエイト連携済み
- Twitter Card設定済み

## アフィリエイト
- 楽天アフィリエイトリンクを6記事に設置済み
- リンクコンポーネント: src/components/Moshimo〇〇.astro 形式（例：MoshimoMantenHotel.astro、MoshimoHotaruika.astroなど）

## スマホ向け改行・レイアウト

### h1タイトルのスマホ改行（displayTitle）
- frontmatterの `title` はOGP用なので `<br>` 禁止
- スマホ用改行は `displayTitle` フィールドに `<span class="sp-br"></span>` を使う
- `text-wrap: initial` をモバイルh1に適用済み（`text-wrap: balance` が改行を無視するため）
- スマホは1行13文字程度が目安

### h2見出しのスマホ改行
- **`<span class="m-line">`で囲む方式**（推奨・確実）
  - 各行に表示したいテキストを `<span class="m-line">テキスト</span>` で囲む
  - CSS: デスクトップは `display: inline`、スマホは `display: block; text-align: center;`
  - `<br class="sp-br" />` 方式より確実（複数brが機能しないことがある）
- **`<br class="sp-br" />`方式**（2箇所以内なら使える）
  - MDXでは必ず自己閉じ `<br class="sp-br" />` にすること（`<br>` はビルドエラー）

### 画像とテキストの順序（side-by-side）
- スマホで画像を上・テキストを下にしたい場合: `class="side-by-side reverse-mobile"` を使う

## 注意事項
- 記事frontmatterのtitleに <br> タグを入れないこと（OGPタイトルに表示されてしまう）
- Googleアドセンス審査中のため、英語版記事（屋久島）は審査通過まで公開しない
- heroImageは必ずBlogPost.astroからBaseHead.astroに渡すこと
- ユーザーがスマホ表示を `/` 区切りで見せているとき → **それが望む表示**。壊れている箇所を示す場合は別途「〜が1行になってる」等と言う

## 今後の予定
- クーリーvsホロ比較記事の執筆
- Googleアドセンス審査通過後に英語版記事を公開
