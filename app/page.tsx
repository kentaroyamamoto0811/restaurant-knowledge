'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

interface RestaurantWithThumbnail extends Restaurant {
  thumbnailUrl?: string | null
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantWithThumbnail[]>([])
  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({})

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    // サムネイル画像を取得
    restaurants.forEach((restaurant) => {
      const url = restaurant.shopUrl || restaurant.urlLink
      if (url && !thumbnails[restaurant.id]) {
        fetchThumbnail(restaurant.id, url)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
        // ローカルストレージにも保存（バックアップ）
        if (typeof window !== 'undefined') {
          localStorage.setItem('restaurants', JSON.stringify(data))
        }
      } else {
        // APIが失敗した場合、ローカルストレージから読み込む
        if (typeof window !== 'undefined') {
          const localData = localStorage.getItem('restaurants')
          if (localData) {
            setRestaurants(JSON.parse(localData))
          }
        }
      }
    } catch (error) {
      console.error('店舗データの取得に失敗しました:', error)
      // エラー時もローカルストレージから読み込む
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('restaurants')
        if (localData) {
          setRestaurants(JSON.parse(localData))
        }
      }
    }
  }

  const fetchThumbnail = async (id: string, url: string) => {
    try {
      const response = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`)
      if (response.ok) {
        const data = await response.json()
        setThumbnails((prev) => ({
          ...prev,
          [id]: data.imageUrl,
        }))
      }
    } catch (error) {
      console.error('サムネイル取得エラー:', error)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) {
      return
    }

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // 一覧を再取得
        fetchRestaurants()
        // ローカルストレージからも削除
        if (typeof window !== 'undefined') {
          const localData = localStorage.getItem('restaurants')
          if (localData) {
            const restaurants = JSON.parse(localData)
            const updated = restaurants.filter((r: Restaurant) => r.id !== id)
            localStorage.setItem('restaurants', JSON.stringify(updated))
          }
        }
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">お店ナレッジ</h1>
          <p className="mt-2 text-gray-600">おいしかった居酒屋・お店を記録</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しいお店を登録
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">まだ登録されたお店がありません</p>
            <p className="text-gray-400 text-sm mt-2">最初のお店を登録してみましょう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => {
              const thumbnailUrl = thumbnails[restaurant.id]
              return (
                <div key={restaurant.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {thumbnailUrl && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 画像読み込みエラー時は非表示
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-900 flex-1 pr-2">{restaurant.name}</h2>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          href={`/register?id=${restaurant.id}`}
                          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-colors"
                          title="編集"
                          aria-label="編集"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(restaurant.id, restaurant.name)}
                          className="inline-flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="削除"
                          aria-label="削除"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      投稿者: {restaurant.author || '匿名'}
                    </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">カテゴリ:</span> {restaurant.category}
                    </p>
                    <p>
                      <span className="font-medium">最寄り駅:</span> {restaurant.nearestStation}
                    </p>
                    <p>
                      <span className="font-medium">住所:</span> {restaurant.address}
                    </p>
                    <p>
                      <span className="font-medium">予算:</span> {restaurant.budget}
                    </p>
                    {restaurant.comment && (
                      <p className="mt-3 text-gray-700 border-t pt-3">
                        {restaurant.comment}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {restaurant.shopUrl && (
                      <a
                        href={restaurant.shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        お店のURL
                      </a>
                    )}
                    {restaurant.urlLink && (
                      <a
                        href={restaurant.urlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        リンク
                      </a>
                    )}
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

