# Vercelデプロイガイド

## 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubでログイン可能）

## デプロイ手順

### ステップ1: GitHubリポジトリの作成とプッシュ（VercelでGitHub連携する場合）

**注意**: VercelでGitHubリポジトリを連携する場合のみ必要です。Vercel CLIや手動アップロードでもデプロイ可能です。

1. GitHubで新しいリポジトリを作成
2. 以下のコマンドを実行：

```bash
cd restaurant-knowledge
git remote add origin https://github.com/your-username/restaurant-knowledge.git
git branch -M main
git push -u origin main
```

**Gitリモートの設定は後で行っても問題ありません。** まずはローカルでGitリポジトリが初期化されているので、後からGitHubにプッシュできます。

### ステップ2: Vercelサイト上でのデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」または「Log In」をクリック
3. GitHubアカウントでログイン（推奨）またはメールアドレスで登録
4. ダッシュボードで「Add New Project」をクリック

**GitHubリポジトリを連携する場合:**
   - 作成したGitHubリポジトリを選択
   - プロジェクト設定を確認：
     - Framework Preset: Next.js（自動検出されるはず）
     - Root Directory: `./`（デフォルト）
     - Build Command: `npm run build`（自動設定）
     - Output Directory: `.next`（自動設定）
   - 「Deploy」をクリック

**手動でアップロードする場合:**
   - 「Import Git Repository」の代わりに「Upload」を選択
   - `restaurant-knowledge`フォルダをZIPで圧縮してアップロード
   - プロジェクト設定を確認して「Deploy」をクリック

### ステップ3: 環境変数の設定（オプション）

Googleマップを表示する場合のみ必要：

1. デプロイ完了後、プロジェクトの「Settings」を開く
2. 「Environment Variables」を選択
3. 以下の環境変数を追加：
   ```
   Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: [取得したAPIキー]
   ```
4. 「Save」をクリック
5. 「Deployments」タブで最新のデプロイを選択し、「Redeploy」をクリック

### ステップ4: 動作確認

デプロイ完了後、Vercelから提供されるURL（例: `https://restaurant-knowledge.vercel.app`）にアクセスして動作を確認してください。

## トラブルシューティング

### ビルドエラーが発生する場合

- Node.jsのバージョンを確認（Vercelの設定で指定可能）
- `package.json`の依存関係が正しいか確認
- ビルドログを確認してエラー内容を特定

### Googleマップが表示されない場合

- 環境変数が正しく設定されているか確認
- APIキーが有効か確認
- Maps Embed APIが有効化されているか確認

### データが保存されない場合

- **現在の実装では、ローカルストレージ（ブラウザ側）にデータが保存されます**
- Vercelの本番環境ではファイルシステムへの書き込みができないため、API経由での保存はできません
- ただし、ローカルストレージ機能により、各ユーザーのブラウザにデータが保存されるため、基本的な動作は可能です
- データを永続化したい場合は、外部データベースの導入を検討してください

## 本番環境でのデータ保存について

現在の実装では、`data/restaurants.json` ファイルにデータを保存していますが、Vercelの本番環境ではファイルシステムへの書き込みができません。

本番環境でデータを永続化するには、以下のいずれかの方法を検討してください：

1. **外部データベースの使用**（推奨）
   - Vercel Postgres
   - Supabase
   - MongoDB Atlas
   - Firebase

2. **外部ストレージの使用**
   - AWS S3
   - Google Cloud Storage

3. **APIサービスの使用**
   - Airtable
   - Notion API

現在の実装は開発環境やデモ用途に適しています。

