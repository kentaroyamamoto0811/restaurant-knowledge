import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getGitHubFile, updateGitHubFile } from '@/lib/github'

const dataFilePath = path.join(process.cwd(), 'data', 'restaurants.json')

// GitHub設定（環境変数から取得）
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'kentaroyamamoto0811'
const GITHUB_REPO = process.env.GITHUB_REPO || 'restaurant-knowledge'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const DATA_FILE_PATH = 'data/restaurants.json'

// GitHub APIを使用するかどうか（トークンが設定されている場合）
const useGitHub = !!GITHUB_TOKEN

interface Restaurant {
  id: string
  name: string
  category: string
  nearestStation: string
  address: string
  budget: string
  phone: string
  shopUrl: string
  comment: string
  urlLink: string
  author: string
  createdAt: string
}

// DELETE: 店舗を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // 既存データを読み込む
    let restaurants: Restaurant[] = []
    let fileSha = ''

    if (useGitHub) {
      // GitHub APIから取得
      const result = await getGitHubFile(
        GITHUB_OWNER,
        GITHUB_REPO,
        DATA_FILE_PATH,
        GITHUB_TOKEN
      )
      if (result) {
        restaurants = result.content
        fileSha = result.sha
      }
    } else {
      // ローカルファイルから取得（開発環境）
      if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath, { encoding: 'utf8' })
        restaurants = JSON.parse(fileData)
      }
    }

    // 削除対象を検索
    const index = restaurants.findIndex((r) => r.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    const deletedRestaurant = restaurants[index]
    restaurants.splice(index, 1)

    // 保存
    if (useGitHub) {
      // GitHub APIで更新
      const success = await updateGitHubFile(
        GITHUB_OWNER,
        GITHUB_REPO,
        DATA_FILE_PATH,
        restaurants,
        fileSha,
        GITHUB_TOKEN,
        `Delete restaurant: ${deletedRestaurant.name}`
      )
      if (!success) {
        return NextResponse.json(
          { error: 'GitHubへの保存に失敗しました' },
          { status: 500 }
        )
      }
    } else {
      // ローカルファイルに保存（開発環境）
      fs.writeFileSync(dataFilePath, JSON.stringify(restaurants, null, 2), { encoding: 'utf8' })
    }

    return NextResponse.json(
      { message: '店舗を削除しました', deleted: deletedRestaurant },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    )
  } catch (error) {
    console.error('データ削除エラー:', error)
    return NextResponse.json(
      { error: 'データの削除に失敗しました' },
      { status: 500 }
    )
  }
}

