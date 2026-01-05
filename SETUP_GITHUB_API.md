# GitHub APIを使用したデータ保存の設定

このアプリは、GitHub APIを使用してリポジトリの `data/restaurants.json` ファイルを直接更新することで、複数のユーザーが入力したデータを共有できます。

## セットアップ手順

### 1. GitHub Personal Access Tokenの作成

1. [GitHub](https://github.com)にログイン
2. 右上のプロフィール画像をクリック → **Settings**
3. 左サイドバーの一番下にある **Developer settings** をクリック
4. **Personal access tokens** → **Tokens (classic)** を選択
5. **Generate new token** → **Generate new token (classic)** をクリック
6. 以下の設定を行います：
   - **Note**: `restaurant-knowledge-api`（任意の名前）
   - **Expiration**: 適切な有効期限を選択（無期限も可能）
   - **Select scopes**: 以下の権限にチェック
     - ✅ `repo` (Full control of private repositories)
       - または、より限定的に `public_repo` のみ（公開リポジトリの場合）
7. **Generate token** をクリック
8. **トークンをコピー**（この画面でしか表示されません！）

### 2. 環境変数の設定

#### ローカル開発環境

プロジェクトルートに `.env.local` ファイルを作成：

```env
GITHUB_OWNER=kentaroyamamoto0811
GITHUB_REPO=restaurant-knowledge
GITHUB_TOKEN=your_personal_access_token_here
```

#### Vercel本番環境

1. [Vercel](https://vercel.com)のプロジェクト設定にアクセス
2. **Settings** → **Environment Variables** を選択
3. 以下の環境変数を追加：

| Name | Value |
|------|-------|
| `GITHUB_OWNER` | `kentaroyamamoto0811` |
| `GITHUB_REPO` | `restaurant-knowledge` |
| `GITHUB_TOKEN` | 作成したPersonal Access Token |

4. **Save** をクリック
5. **Deployments** タブで最新のデプロイを選択し、**Redeploy** をクリック

### 3. 動作確認

環境変数を設定後、以下を確認してください：

1. 新しい店舗を登録
2. GitHubリポジトリの `data/restaurants.json` が更新されているか確認
3. 他のユーザーが同じデータを見られるか確認

## 動作モード

### GitHub APIモード（推奨・本番環境）

- `GITHUB_TOKEN` が設定されている場合
- GitHub APIを使用して `data/restaurants.json` を直接更新
- 複数のユーザーが同じデータを共有可能
- データはGitリポジトリに保存されるため、バージョン管理が可能

### ローカルファイルモード（開発環境）

- `GITHUB_TOKEN` が設定されていない場合
- ローカルの `data/restaurants.json` に保存
- 開発・テスト用途

## セキュリティ注意事項

⚠️ **重要**: 
- GitHub Personal Access Tokenは**絶対に**公開リポジトリにコミットしないでください
- `.env.local` は `.gitignore` に含まれていることを確認してください
- トークンが漏洩した場合は、すぐにGitHubでトークンを無効化してください

## トラブルシューティング

### エラー: "GitHub API error: 401"

- トークンが正しく設定されているか確認
- トークンの権限（`repo` または `public_repo`）が正しいか確認

### エラー: "GitHub API error: 404"

- `GITHUB_OWNER` と `GITHUB_REPO` が正しいか確認
- リポジトリが存在し、アクセス可能か確認

### データが更新されない

- Vercelの環境変数が正しく設定されているか確認
- デプロイ後に環境変数が反映されているか確認（再デプロイが必要な場合あり）

