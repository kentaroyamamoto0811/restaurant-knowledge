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
  createdAt: string
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    fetchRestaurants()
  }, [])

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
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
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
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

