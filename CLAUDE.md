# 一山一会 ブログ開発メモ

## サイト概要
- URL: https://ichizanichie.com
- フレームワーク: Astro
- ホスティング: Cloudflare Pages
- GitHubリポジトリ: hiker-hachi/blog

## 記事管理
- 記事ファイルの場所: src/content/blog/
- 画像の場所: src/assets/ または public/
- 投稿ペース: ブログ週1本。インスタは2026-09-08に定期投稿をやめた（ブログへの流入が28日で2人だったため）。上げたいときにハチさんが自分で上げる。クロコからインスタ投稿・告知を提案しない

## 設定済みの機能
- SEO設定済み（BaseHead.astro）
- OGP設定済み（og:title / og:description / og:image / og:type / og:site_name / og:locale）
- OGP画像は getImage() で自動最適化（WebP・1200x630px・138KB程度）
- Google Search Console登録・サイトマップ送信済み
- もしもアフィリエイト連携済み（楽天市場・楽天トラベル・Yahoo!ショッピング）。楽天直・ヤフー直の契約はしていない
- Twitter Card設定済み

## アフィリエイト
- もしものリンクを24記事・46コンポーネントに設置済み（2026-09-07時点）
- Amazon（もしも経由の Amazon.co.jp限定プログラム）は申請予定。一度不合格になっている
- 記事の冒頭に出る広告表記（PR表記）は PrNotice.astro。記事本文に `<Moshimo` があるかで自動判定するので、記事側に書き足す必要はない
- リンクコンポーネント: src/components/Moshimo〇〇.astro 形式（例：MoshimoMantenHotel.astro、MoshimoHotaruika.astroなど）

## 注意事項
- 記事frontmatterのtitleに <br> タグを入れないこと（OGPタイトルに表示されてしまう）
- Googleアドセンスは2回不合格（いずれも投稿直後で、記事数・訪問者が少なすぎたのが原因）。訪問者が増えてから再申請する方針で、今は急がない。英語版記事（屋久島・立山）は当面公開しない（まずは日本語のニッチに集中）
- heroImageは必ずBlogPost.astroからBaseHead.astroに渡すこと

## 今後の予定
- クーリーvsホロ比較記事の執筆
- （ずっと先）訪問者が育ったらアドセンス再申請 →通過後に英語版（屋久島・立山など海外人気の高い記事のみ）を公開
