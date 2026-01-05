/**
 * GitHub APIを使用してリポジトリのファイルを読み書きするユーティリティ
 */

interface GitHubFileContent {
  content: string
  sha?: string
}

/**
 * GitHub APIからファイルの内容を取得
 */
export async function getGitHubFile(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<{ content: any; sha: string } | null> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // ファイルが存在しない場合は空配列を返す
        return { content: [], sha: '' }
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    // Base64デコード
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const jsonContent = content.trim() ? JSON.parse(content) : []

    return {
      content: jsonContent,
      sha: data.sha,
    }
  } catch (error) {
    console.error('GitHubファイル取得エラー:', error)
    return null
  }
}

/**
 * GitHub APIでファイルを更新
 */
export async function updateGitHubFile(
  owner: string,
  repo: string,
  path: string,
  content: any,
  sha: string,
  token: string,
  message: string = 'Update restaurants data'
): Promise<boolean> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    
    // Base64エンコード
    const contentString = JSON.stringify(content, null, 2)
    const encodedContent = Buffer.from(contentString, 'utf-8').toString('base64')

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha: sha || undefined,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API更新エラー:', errorData)
      return false
    }

    return true
  } catch (error) {
    console.error('GitHubファイル更新エラー:', error)
    return false
  }
}

