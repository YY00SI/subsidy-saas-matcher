# 補助金SaaSマッチャー (Subsidy SaaS Matcher) Rule

## 基本方針
- MVPとして、会計ソフト・インボイス対応のSaaSツール（freee等）とJGrantsの補助金情報を自動マッチングさせる静的サイトを構築する。
- **インフラ・運用**: 初期費用・維持費ともに完全0円（GitHub Actions + GitHub Pages等）。
- **AI制御システム制約**: AIは開発環境のみでの利用とする。ランタイムのLLM呼び出しは行わない。
- **標準フォルダ構成の遵守**:
  - `docs/` に設計書や記録を配置
  - `output/` に出力結果やレポートを配置
  - `data/` にローカルのAPIキャッシュ等を保存
  - `docs/current_status.md` に現在の中断状況やコンテキスト、次回のタスクを必ず記録し、再開時に参照する

