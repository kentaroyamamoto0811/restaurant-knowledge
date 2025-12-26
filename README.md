# お店ナレッジ

おいしかった居酒屋やお店をナレッジとして登録・管理できるサイトです。

## 機能

- 店舗情報の登録（店名、カテゴリ、最寄り駅、住所、予算感、電話番号、お店のURL、コメント/感想、URLリンク）
- 店舗一覧の表示
- 住所入力によるGoogleマップ表示
- JSONファイルによるデータ永続化（データベース不要）

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Maps Embed API

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリをVercelに接続
3. プロジェクトをデプロイ

### Google Maps API キーの設定（オプション）

Googleマップを表示するには、Google Maps Embed APIのキーが必要です。

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. Maps Embed APIを有効化
3. APIキーを取得
4. `app/register/page.tsx`の`YOUR_API_KEY`を実際のAPIキーに置き換え

**注意**: 無料枠でも使用可能ですが、APIキーを公開リポジトリにコミットしないよう注意してください。環境変数を使用することを推奨します。

## データ管理

店舗データは `data/restaurants.json` ファイルに保存されます。このファイルはGitで管理されるため、バージョン管理が可能です。

## ライセンス

MIT

