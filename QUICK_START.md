# クイックスタートガイド

## 現在の状態

✅ Gitリポジトリは初期化済み（ローカル）
✅ すべてのコードはコミット済み
✅ Vercelデプロイの準備完了

## 次のステップ

### 1. GitHubリポジトリの作成（任意）

GitHubでリポジトリを作成する場合：

```bash
# GitHubでリポジトリを作成後、以下のコマンドを実行
cd C:\Cursor\restaurant-knowledge
git remote add origin https://github.com/your-username/restaurant-knowledge.git
git branch -M main
git push -u origin main
```

**注意**: Gitリモートの設定は後で行っても問題ありません。まずはVercelでデプロイできます。

### 2. Vercelでのデプロイ

1. [Vercel](https://vercel.com)にアクセスしてログイン
2. 「Add New Project」をクリック
3. 以下のいずれかを選択：
   - **GitHubリポジトリを連携**: リポジトリを選択してデプロイ
   - **手動アップロード**: `restaurant-knowledge`フォルダをZIPで圧縮してアップロード
4. プロジェクト設定を確認（Next.jsは自動検出されます）
5. 「Deploy」をクリック

### 3. 環境変数の設定（オプション）

Googleマップを表示する場合のみ：

1. デプロイ後、プロジェクトの「Settings」→「Environment Variables」
2. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を追加
3. 再デプロイ

## データ保存について

- **開発環境**: `data/restaurants.json` に保存
- **本番環境（Vercel）**: ブラウザのローカルストレージに保存（各ユーザーごと）
- データを永続化したい場合は、外部データベースの導入を検討してください

## 動作確認

デプロイ後、Vercelから提供されるURLにアクセスして動作を確認してください。

