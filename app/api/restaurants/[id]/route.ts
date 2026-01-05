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
  rating: number
  createdAt: string
}

// GET: 特定の店舗を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // 既存データを読み込む
    let restaurants: Restaurant[] = []

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
      }
    } else {
      // ローカルファイルから取得（開発環境）
      if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath, { encoding: 'utf8' })
        restaurants = JSON.parse(fileData)
      }
    }

    // 対象を検索
    const restaurant = restaurants.find((r) => r.id === id)
    if (!restaurant) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('データ取得エラー:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// PUT: 店舗を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // バリデーション
    if (!body.name || !body.category || !body.nearestStation || !body.address) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

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

    // 更新対象を検索
    const index = restaurants.findIndex((r) => r.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // データを更新（IDと作成日時は保持）
    const existingRestaurant = restaurants[index]
    restaurants[index] = {
      ...existingRestaurant,
      name: body.name,
      category: body.category,
      nearestStation: body.nearestStation,
      address: body.address,
      budget: body.budget || '',
      phone: body.phone || '',
      shopUrl: body.shopUrl || '',
      comment: body.comment || '',
      urlLink: body.urlLink || '',
      author: body.author || '匿名',
      rating: body.rating ? Number(body.rating) : 0,
    }

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
        `Update restaurant: ${body.name}`
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

    return NextResponse.json(restaurants[index], {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('データ更新エラー:', error)
    return NextResponse.json(
      { error: 'データの更新に失敗しました' },
      { status: 500 }
    )
  }
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

