# subsidy-saas-matcher 進捗の正本

## 現在のフェーズ
収益化導線・コンテンツ拡充フェーズ

## 完了済み
- 2026-05-24: AstroビルドがCドライブへテレメトリ設定を書こうとして失敗していたため、`scripts/astro-cli.mjs` を追加し、Astro実行時の設定保存先をプロジェクト内に固定。`npm run build` がDドライブ内で完結する状態に修正。
- 2026-05-24: 収益導線の `rel` を `sponsored noopener noreferrer` に統一。
- 2026-05-24: 高意図の悩み別ページ `/needs/cashflow/` と `/needs/startup/` を追加。補助金後払いの資金ショート対策、創業直後の口座・登記住所・請求書準備からA8案件へ誘導。
- 2026-05-24: ヘッダーに資金繰り・サービス一覧導線を追加。
- 2026-05-24: 軽量モデル向け継続拡充手順 `docs/CONTENT_FACTORY.md` とPDCA必要情報 `docs/PDCA_REQUIREMENTS.md` を追加。

## 進行中
- Google Search Console / A8.net / GA4 の数値を使ったPDCA運用準備

## 次のアクション
1. A8.netで提携済み案件、クリック、成果、EPC、承認率を確認する。
2. Google Search Consoleでインデックス状況と検索クエリを確認する。
3. 成果が出た案件の悩み別ページを追加する。
4. 新規補助金データ取得後に `npm run update:all`、`npm run test`、`npm run build` を実行する。

## 判断ログ
- 2026-05-24: アクセスゼロ状態では補助金一覧だけではCVに遠いため、補助金利用者が実際に詰まる「後払いの資金ショート」と「創業初期の口座・住所・請求書準備」を収益導線の中心に置いた。
- 2026-05-24: A8.netとGitHubのID/PWはユーザー提供済みだが、パスワード保存は禁止。PDCA資料にも認証情報そのものは残さず、必要サイトと取得すべき数値だけを記録する方針。
