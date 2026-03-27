# 補助金SaaSマッチャー (Subsidy SaaS Matcher)

JGrantsの補助金情報を自動収集し、会計ソフトやインボイス対応ツールと自動マッチングして提供する静的サイトジェネレーターです。

## 🚀 特徴
- **フル自動運用**: GitHub Actionsにより毎日最新の補助金情報を取得し、サイトを更新します。
- **コスト0円**: GitHub Pages (ホスティング) と GitHub Actions (実行環境) の無料枠のみで稼働します。
- **マッチングロジック**: 各補助金の内容を解析し、最適なSaaSツール（freee等）を自動で提案します。

## 🛠 技術スタック
- **Framework**: Astro (Static Site Generation)
- **Language**: TypeScript
- **Data Source**: JGrants API (Digital Agency)
- **CI/CD**: GitHub Actions

## 📂 フォルダ構成
- `src/`: Astroコンポーネント、ページ、ロジック
- `scripts/`: データ取得・ビルド用スクリプト
- `data/raw/`: APIから取得した生のJSONデータ
- `data/processed/`: 正規化・分類済みのデータ
- `data/tools.json`: 紹介するツールのマスターデータ
- `docs/`: 要件定義・設計ドキュメント
- `output/`: レポート出力先

## ⚙️ 運用・カスタマイズ
### ツールの追加
`data/tools.json` に新しいツールを追加し、アフィリエイトリンクを設定するだけで、関連する補助金ページに自動で表示されるようになります。

### マッチング基準の変更
`data/taxonomy.json` のキーワードを調整することで、補助金の分類精度を向上させることができます。

### ローカルでの開発
```bash
npm install     # 依存関係のインストール
npm run dev     # 開発サーバー起動
npm run update:all # データの強制更新
npm run build   # 静的サイトのビルド
```

## ⚠️ 免責事項
当サイトの情報は公的な公開データを元に生成されていますが、正確性や最新性を保証するものではありません。補助金の申請にあたっては必ず各事務局の公式サイトを確認してください。
