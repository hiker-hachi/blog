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

## 注意事項
- 記事frontmatterのtitleに <br> タグを入れないこと（OGPタイトルに表示されてしまう）
- Googleアドセンス審査中のため、英語版記事（屋久島）は審査通過まで公開しない
- heroImageは必ずBlogPost.astroからBaseHead.astroに渡すこと

## 今後の予定
- クーリーvsホロ比較記事の執筆
- Googleアドセンス審査通過後に英語版記事を公開
