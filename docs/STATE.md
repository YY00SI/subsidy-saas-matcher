# subsidy-saas-matcher 進捗の正本

## 現在のフェーズ
収益化導線・コンテンツ拡充フェーズ

## 完了済み
- 2026-05-31: 月末PDCAのAct実装を完了。トップページに補助金後払いの資金繰り注意喚起を追加し、`/needs/cashflow/` のファーストビューCTAを具体化。診断結果に資金繰り・請求書・会計の次導線を追加し、MisocaとCLOUDPHONEも候補に含めた。A8リンククリックはGA4へ `a8_affiliate_click` を送信。`npm run test`、`npm run build`（37ページ生成）、`npm run audit`（37 HTML pages checked）は成功。
- 2026-05-31: ログイン後に未取得だった月末PDCA数値を再取得し、`docs/monthly_pdca_2026_05.md` に追記。Google Search Consoleは合計クリック0、合計表示21、平均CTR 0%、平均掲載順位5（画面表示期間 2026/04/04-2026/05/29）、確認できたクエリは `aiマッチング精度が高い助成金検索saas` 表示2。A8.netは今月インプレッション9、クリック0、発生件数0、発生金額0円、確定金額0円。日別は 2026/05/25 imp 8、2026/05/29 imp 1。参加中プログラム14件のEPC/確定率も確認し、CLOUDPHONE、弥生、Misoca、京都朱雀スタジオを優先候補として記録。公開トップ、`/needs/cashflow/`、`/tools/freee-accounting/` の表示、canonical、A8リンク、`sponsored` 属性も再確認済み。
- 2026-05-31: A8詳細分析を受けて、`/needs/cashflow/`、`/needs/startup/`、`/needs/invoice/`、`/needs/accounting/` の導線を調整。CLOUDPHONE、弥生、Misoca、京都朱雀スタジオへの導線を強化し、`npm run test`、`npm run build`、`npm run audit` はすべて成功。
- 2026-05-29: 5月末PDCAを実施し、`docs/monthly_pdca_2026_05.md` を作成。`npm run test` は1ファイル2テスト成功、`npm run build` は47ページ生成、`npm run audit` は `Site audit passed: 47 HTML pages checked.`。公開トップ、`/needs/cashflow/`、`/tools/freee-accounting/` をブラウザで確認し、canonicalとA8リンクの `sponsored` 属性を確認。A8.netの簡易レポートでは今月インプレッション8、クリック0、発生件数0、発生金額0円、確定金額0円を確認。
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
- A8優先案件に合わせた導線改善と補助金SaaS単独のGA4確認

## 次のアクション
1. A8.netで優先度が高かったCLOUDPHONE、弥生、Misoca、京都朱雀スタジオのクリック発生有無を次回レポートで確認し、クリックが出た案件の周辺ページを追加する。
2. Search Consoleで露出が出た `aiマッチング精度が高い助成金検索saas` を起点に、トップページと診断ページのtitle/meta/本文冒頭を「補助金 AIマッチング」「助成金検索 SaaS」寄りへ調整する。
3. GA4で補助金SaaS単独プロパティ、または `G-KW3V1L5HN9` の収集先を確認し、PV、参照元、CTAクリックを取得できる状態にする。
4. GA4の `a8_affiliate_click` が受信されているか確認し、キーイベント化する。
5. 成果が出た案件の周辺ページ、または未作成の案件ページを追加する。
6. 新規補助金データ取得後に `npm run update:all`、`npm run test`、`npm run build`、`npm run audit` を実行する。

## 判断ログ
- 2026-05-31: 月末PDCAの未取得情報を再取得。Search Consoleは表示21・クリック0で、平均掲載順位5は良いが露出母数が少ない。現段階の課題はCVRではなく、検索露出の増加とA8リンククリックの発生。GA4は `src/components/SeoHead.astro` に `G-KW3V1L5HN9` が設定済みだが、画面上では補助金SaaS単独プロパティを確認できず、LifeTech Select側にSearch Console連携推奨が表示されたため、計測先確認を次回優先する。A8新管理画面のプログラム別レポートは本文が空白だったが、旧管理画面で日別・成果・素材別・無効クリック・参加中プログラムを取得できた。
- 2026-05-29: 月末PDCAではA8簡易レポートのみ取得成功。今月インプレッション8に対してクリック0のため、現段階の課題はCVRではなくA8リンククリックの発生。公開ページ側にはA8導線と `sponsored` 属性があり、ローカル品質ゲートも通過。Search Consoleは案内ページ、GA4はGoogleアカウント側の本人確認待ち表示で止まったため、検索露出とPVは未取得。
- 2026-05-24: ユーザー実行後の公開確認をブラウザで実施。ローカルは `npm run test` 成功、`npm run build` 成功（45ページ生成）だが、GitHub push は保存済みトークン無効で失敗。公開側では `/needs/cashflow/`、`/needs/startup/`、補助金詳細ページ群が404で未反映。公開中の代表ページはブラウザで確認し、横スクロールなし、CTAあり、A8導線あり。診断結果のA8リンクはローカル先行コミットでは `rel="sponsored noopener noreferrer"` 済みだが、公開側は未反映。
- 2026-05-24: アクセスゼロ状態では補助金一覧だけではCVに遠いため、補助金利用者が実際に詰まる「後払いの資金ショート」と「創業初期の口座・住所・請求書準備」を収益導線の中心に置いた。
- 2026-05-24: A8.netとGitHubのID/PWはユーザー提供済みだが、パスワード保存は禁止。PDCA資料にも認証情報そのものは残さず、必要サイトと取得すべき数値だけを記録する方針。
- 2026-05-24: GitHub push時の認証エラー原因が、リモートURLへの直接パスワード（PAT）埋め込みであることが判明。ルールに従ってパスワードを削除し、Windows側のGit Credential Managerでのブラウザ認証へ移行して解決。
- 2026-05-24: PDCAの数値データ取得までの間にコンテンツ拡充を進めるため、「法人カード選び」と「バーチャルオフィス登記」の悩み別ページを追加。これによりA8の主要案件カテゴリー（会計・請求書・資金繰り・法人カード・バーチャルオフィス等）の受け皿が概ね揃った。
