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

### Vercelへのデプロイ手順

#### 1. GitHubリポジトリの作成

```bash
# GitHubでリポジトリを作成後、以下のコマンドを実行
git remote add origin https://github.com/your-username/restaurant-knowledge.git
git branch -M main
git push -u origin main
```

#### 2. Vercelでのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成（GitHubアカウントでログイン推奨）
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定：
   - Framework Preset: Next.js（自動検出されるはず）
   - Root Directory: `./`（デフォルト）
   - Build Command: `npm run build`（自動設定）
   - Output Directory: `.next`（自動設定）
5. 「Deploy」をクリック

#### 3. 環境変数の設定（オプション）

Googleマップを表示する場合：

1. Vercelのプロジェクト設定画面で「Environment Variables」を開く
2. 以下の環境変数を追加：
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: 取得したGoogle Maps APIキー
3. 「Save」をクリック
4. 再デプロイを実行

### Google Maps API キーの取得方法（オプション）

Googleマップを表示するには、Google Maps Embed APIのキーが必要です。

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」に移動
4. 「Maps Embed API」を検索して有効化
5. 「認証情報」→「認証情報を作成」→「APIキー」を選択
6. APIキーをコピー

**注意**: 
- 無料枠でも使用可能ですが、APIキーを公開リポジトリにコミットしないよう注意してください
- Vercelの環境変数を使用することを強く推奨します
- APIキーが設定されていない場合でも、Googleマップへのリンクは機能します

## データ管理

店舗データは `data/restaurants.json` ファイルに保存されます。このファイルはGitで管理されるため、バージョン管理が可能です。

## ライセンス

MIT

