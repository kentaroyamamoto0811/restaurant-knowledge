import { NextRequest, NextResponse } from 'next/server'

/**
 * OGP画像を取得するAPI
 * URLからOGPメタタグを解析して画像URLを返す
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    // URLのOGP画像を取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RestaurantKnowledge/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: 500 }
      )
    }

    const html = await response.text()
    
    // OGP画像を抽出
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
    if (ogImageMatch && ogImageMatch[1]) {
      return NextResponse.json({ imageUrl: ogImageMatch[1] })
    }

    // Twitter Card画像を試す
    const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)
    if (twitterImageMatch && twitterImageMatch[1]) {
      return NextResponse.json({ imageUrl: twitterImageMatch[1] })
    }

    // 見つからない場合はnullを返す
    return NextResponse.json({ imageUrl: null })
  } catch (error) {
    console.error('OGP画像取得エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch OGP image' },
      { status: 500 }
    )
  }
}

