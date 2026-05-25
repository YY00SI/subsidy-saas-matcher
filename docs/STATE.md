# subsidy-saas-matcher 進捗の正本

## 現在のフェーズ
収益化導線・コンテンツ拡充フェーズ

## 完了済み
- 2026-05-24: 生成済みサイト監査 `npm run audit` を追加。45ページ全体のcanonical/OG URL、meta description、sitemap掲載、外部リンクの `noopener noreferrer`、A8リンクの `sponsored` を検査する。GitHub Actionsにも監査ステップを追加し、公開前に品質ゲートを通す構成へ更新。
- 2026-05-24: ページ共通SEOを改善。`SeoHead.astro` でページごとのcanonical/OG/Twitter URLとrobots metaを出力し、診断ページにも同等のSEOタグを追加。補助金詳細ページは短すぎる説明文を補完し、データ由来HTML内の外部リンクにも `rel="noopener noreferrer"` を付与。
- 2026-05-24: AstroビルドがCドライブへテレメトリ設定を書こうとして失敗していたため、`scripts/astro-cli.mjs` を追加し、Astro実行時の設定保存先をプロジェクト内に固定。`npm run build` がDドライブ内で完結する状態に修正。
- 2026-05-24: 収益導線の `rel` を `sponsored noopener noreferrer` に統一。
- 2026-05-24: 高意図の悩み別ページ `/needs/cashflow/` と `/needs/startup/` を追加。補助金後払いの資金ショート対策、創業直後の口座・登記住所・請求書準備からA8案件へ誘導。
- 2026-05-24: ヘッダーに資金繰り・サービス一覧導線を追加。
- 2026-05-24: 軽量モデル向け継続拡充手順 `docs/CONTENT_FACTORY.md` とPDCA必要情報 `docs/PDCA_REQUIREMENTS.md` を追加。
- 2026-05-24: GitHubの認証エラーを解消。リモートURLに直接埋め込まれていた無効なPAT（パスワード）を削除し、ブラウザ認証に移行してデプロイを正常化。
- 2026-05-24: 悩み別ページ「法人カード（creditcard.astro）」「バーチャルオフィス（virtualoffice.astro）」を新規作成。ヘッダーのナビゲーションに導線を追加し、`npm run build` および `npm run audit` を通過させて公開環境にデプロイ。

## 進行中
- Google Search Console / A8.net / GA4 の数値を使ったPDCA運用準備

## 次のアクション
1. A8.netで提携済み案件、クリック、成果、EPC、承認率を確認する。
2. Google Search Consoleでインデックス状況と検索クエリを確認する。
3. 成果が出た案件の周辺ページ、または未作成の案件ページを追加する。
4. 新規補助金データ取得後に `npm run update:all`、`npm run test`、`npm run build` を実行する。

## 判断ログ
- 2026-05-24: ユーザー実行後の公開確認をブラウザで実施。ローカルは `npm run test` 成功、`npm run build` 成功（45ページ生成）だが、GitHub push は保存済みトークン無効で失敗。公開側では `/needs/cashflow/`、`/needs/startup/`、補助金詳細ページ群が404で未反映。公開中の代表ページはブラウザで確認し、横スクロールなし、CTAあり、A8導線あり。診断結果のA8リンクはローカル先行コミットでは `rel="sponsored noopener noreferrer"` 済みだが、公開側は未反映。
- 2026-05-24: アクセスゼロ状態では補助金一覧だけではCVに遠いため、補助金利用者が実際に詰まる「後払いの資金ショート」と「創業初期の口座・住所・請求書準備」を収益導線の中心に置いた。
- 2026-05-24: A8.netとGitHubのID/PWはユーザー提供済みだが、パスワード保存は禁止。PDCA資料にも認証情報そのものは残さず、必要サイトと取得すべき数値だけを記録する方針。
- 2026-05-24: GitHub push時の認証エラー原因が、リモートURLへの直接パスワード（PAT）埋め込みであることが判明。ルールに従ってパスワードを削除し、Windows側のGit Credential Managerでのブラウザ認証へ移行して解決。
- 2026-05-24: PDCAの数値データ取得までの間にコンテンツ拡充を進めるため、「法人カード選び」と「バーチャルオフィス登記」の悩み別ページを追加。これによりA8の主要案件カテゴリー（会計・請求書・資金繰り・法人カード・バーチャルオフィス等）の受け皿が概ね揃った。
