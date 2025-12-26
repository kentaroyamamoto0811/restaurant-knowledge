import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'restaurants.json')

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
  createdAt: string
}

// GET: 店舗一覧を取得
export async function GET() {
  try {
    // ファイルが存在しない場合は空配列を返す
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json([])
    }

    const fileData = fs.readFileSync(dataFilePath, 'utf-8')
    const restaurants = JSON.parse(fileData)
    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('データ読み込みエラー:', error)
    return NextResponse.json(
      { error: 'データの読み込みに失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい店舗を登録
export async function POST(request: NextRequest) {
  try {
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
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8')
      restaurants = JSON.parse(fileData)
    }

    // 新しい店舗データを作成
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: body.name,
      category: body.category,
      nearestStation: body.nearestStation,
      address: body.address,
      budget: body.budget || '',
      phone: body.phone || '',
      shopUrl: body.shopUrl || '',
      comment: body.comment || '',
      urlLink: body.urlLink || '',
      createdAt: new Date().toISOString(),
    }

    // データを追加
    restaurants.push(newRestaurant)

    // ファイルに保存
    fs.writeFileSync(dataFilePath, JSON.stringify(restaurants, null, 2), 'utf-8')

    return NextResponse.json(newRestaurant, { status: 201 })
  } catch (error) {
    console.error('データ保存エラー:', error)
    return NextResponse.json(
      { error: 'データの保存に失敗しました' },
      { status: 500 }
    )
  }
}

