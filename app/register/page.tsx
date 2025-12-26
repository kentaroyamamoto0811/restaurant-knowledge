'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    nearestStation: '',
    address: '',
    budget: '',
    phone: '',
    shopUrl: '',
    comment: '',
    urlLink: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mapUrl, setMapUrl] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 住所が入力されたらGoogleマップのURLを生成
    if (name === 'address' && value) {
      const encodedAddress = encodeURIComponent(value)
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newRestaurant = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }

      // APIに送信を試みる
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // ローカルストレージにも保存（フォールバック）
      if (typeof window !== 'undefined') {
        const existingData = localStorage.getItem('restaurants')
        const restaurants = existingData ? JSON.parse(existingData) : []
        restaurants.push(newRestaurant)
        localStorage.setItem('restaurants', JSON.stringify(restaurants))
      }

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        // APIが失敗してもローカルストレージには保存済み
        alert('登録しました（ローカルストレージに保存）。ページを更新してください。')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('登録エラー:', error)
      // エラー時もローカルストレージに保存
      if (typeof window !== 'undefined') {
        const newRestaurant = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        }
        const existingData = localStorage.getItem('restaurants')
        const restaurants = existingData ? JSON.parse(existingData) : []
        restaurants.push(newRestaurant)
        localStorage.setItem('restaurants', JSON.stringify(restaurants))
        alert('登録しました（ローカルストレージに保存）。ページを更新してください。')
        router.push('/')
        router.refresh()
      } else {
        alert('登録に失敗しました。もう一度お試しください。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Google Maps Embed APIを使わずに、リンクとして表示する方法
  const getGoogleMapsLink = (address: string) => {
    if (!address) return ''
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">新しいお店を登録</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              店名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              <option value="居酒屋">居酒屋</option>
              <option value="レストラン">レストラン</option>
              <option value="カフェ">カフェ</option>
              <option value="焼肉">焼肉</option>
              <option value="寿司">寿司</option>
              <option value="ラーメン">ラーメン</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label htmlFor="nearestStation" className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nearestStation"
              name="nearestStation"
              required
              value={formData.nearestStation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              住所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="例: 東京都渋谷区..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.address && (
              <div className="mt-3">
                <a
                  href={getGoogleMapsLink(formData.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Googleマップで開く
                </a>
                <div className="mt-2 border rounded-lg overflow-hidden bg-gray-100">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(formData.address)}`}
                    ></iframe>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <p className="mb-2">Googleマップを表示するにはAPIキーが必要です</p>
                        <a
                          href={getGoogleMapsLink(formData.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          リンクからGoogleマップを開く
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              予算感
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              <option value="〜1,000円">〜1,000円</option>
              <option value="1,000〜3,000円">1,000〜3,000円</option>
              <option value="3,000〜5,000円">3,000〜5,000円</option>
              <option value="5,000〜10,000円">5,000〜10,000円</option>
              <option value="10,000円〜">10,000円〜</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shopUrl" className="block text-sm font-medium text-gray-700 mb-1">
              お店のURL
            </label>
            <input
              type="url"
              id="shopUrl"
              name="shopUrl"
              value={formData.shopUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              コメント/感想
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="urlLink" className="block text-sm font-medium text-gray-700 mb-1">
              URLリンク
            </label>
            <input
              type="url"
              id="urlLink"
              name="urlLink"
              value={formData.urlLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

