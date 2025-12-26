# コミットメッセージの文字化け修正方法

過去のコミットメッセージが文字化けしている場合の修正方法です。

## 注意事項

⚠️ **既にGitHubにプッシュされているコミットを修正する場合、force pushが必要になります。**
他の人がこのリポジトリを使用している場合は、事前に確認してください。

## 修正手順

### 方法1: Git Rebaseを使用（推奨）

1. エディタを設定（PowerShellで実行）:
```powershell
$env:GIT_EDITOR='code --wait'  # VS Codeを使用する場合
# または
$env:GIT_EDITOR='notepad'      # メモ帳を使用する場合
```

2. インタラクティブリベースを開始:
```powershell
git rebase -i --root
```

3. エディタが開いたら、修正したいコミットの `pick` を `reword` に変更:
```
reword d52b214 Initial commit: 縺雁ｺ励リ繝ｬ繝・ず繧ｵ繧､繝医・菴懈・
reword afadf44 繝ｭ繝ｼ繧ｫ繝ｫ繧ｹ繝医Ξ繝ｼ繧ｸ繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ讖溯・縺ｨVercel繝・・繝ｭ繧､繧ｬ繧､繝峨ｒ霑ｽ蜉
pick 00b0e88 Update deploy guide
pick 91eee12 Fix character encoding issues for comments
```

4. 各コミットメッセージを正しい日本語に修正:
   - `d52b214`: `Initial commit: お店ナレッジサイトの作成`
   - `afadf44`: `ローカルストレージフォールバック機能とVercelデプロイガイドを追加`

5. 修正が完了したら、force push:
```powershell
git push --force origin main
```

### 方法2: コミットメッセージファイルを使用

1. 修正したいコミットメッセージをファイルに保存（UTF-8エンコーディング）:
```powershell
# commit_msg.txt を作成（UTF-8エンコーディング）
"Initial commit: お店ナレッジサイトの作成" | Out-File -Encoding UTF8 commit_msg.txt
```

2. コミットを修正:
```powershell
git commit --amend -F commit_msg.txt
```

3. 他のコミットも同様に修正（rebaseを使用）

## 今後の対策

コミットメッセージが正しく表示されるように、以下の設定を確認してください:

```powershell
# UTF-8エンコーディングを設定
git config --global i18n.commitencoding utf-8
git config --global core.quotepath false

# PowerShellのエンコーディングを設定
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

## 現在のコミット一覧

- `d52b214`: Initial commit（文字化け）
- `afadf44`: ローカルストレージフォールバック機能追加（文字化け）
- `00b0e88`: Update deploy guide（正常）
- `91eee12`: Fix character encoding issues for comments（正常）

