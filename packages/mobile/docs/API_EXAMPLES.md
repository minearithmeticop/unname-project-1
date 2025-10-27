# API Integration Examples

## ตัวอย่างการใช้งาน API Services จริง

### 1. 🎯 JSONPlaceholder Example (สำหรับเริ่มต้น)

#### Setup API Service
```typescript
// src/services/jsonPlaceholderApi.ts
const BASE_URL = 'https://jsonplaceholder.typicode.com'

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export const jsonPlaceholderApi = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts`)
    if (!response.ok) throw new Error('Failed to fetch posts')
    return response.json()
  },

  // Get single post
  getPost: async (id: number): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch post')
    return response.json()
  },

  // Create post
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) throw new Error('Failed to create post')
    return response.json()
  },

  // Update post
  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) throw new Error('Failed to update post')
    return response.json()
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete post')
  },

  // Get users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },
}
```

#### Custom Hook
```typescript
// src/hooks/usePosts.ts
import { useState, useEffect } from 'react'
import { jsonPlaceholderApi, Post } from '../services/jsonPlaceholderApi'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jsonPlaceholderApi.getPosts()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = async (post: Omit<Post, 'id'>) => {
    try {
      setLoading(true)
      const newPost = await jsonPlaceholderApi.createPost(post)
      setPosts([newPost, ...posts])
      return newPost
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: number) => {
    try {
      setLoading(true)
      await jsonPlaceholderApi.deletePost(id)
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost,
    deletePost,
  }
}
```

#### Component Usage
```typescript
// app/(tabs)/posts.tsx
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native'
import { useState } from 'react'
import { Typography } from '../../src/components/atoms/Typography'
import { Button } from '../../src/components/atoms/Button'
import { Card } from '../../src/components/molecules/Card'
import { usePosts } from '../../src/hooks/usePosts'
import { SPACING } from '../../src/constants'

export default function PostsScreen() {
  const { posts, loading, error, refetch, createPost, deletePost } = usePosts()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const handleCreatePost = async () => {
    try {
      await createPost({
        userId: 1,
        title: 'New Post',
        body: 'This is a new post created from React Native!',
      })
      Alert.alert('Success', 'Post created successfully!')
    } catch (err) {
      Alert.alert('Error', 'Failed to create post')
    }
  }

  const handleDeletePost = async (id: number) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(id)
              Alert.alert('Success', 'Post deleted successfully!')
            } catch (err) {
              Alert.alert('Error', 'Failed to delete post')
            }
          },
        },
      ]
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Typography variant="h2">Error</Typography>
        <Typography variant="body" style={{ color: 'red' }}>
          {error}
        </Typography>
        <Button title="Retry" onPress={refetch} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Button
        title="Create New Post"
        onPress={handleCreatePost}
        variant="primary"
        style={styles.createButton}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            description={item.body}
            onPress={() => handleDeletePost(item.id)}
            buttonText="Delete"
            variant="ghost"
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createButton: {
    margin: SPACING.md,
  },
  list: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
})
```

---

### 2. 🌤️ Weather API Example (Open-Meteo)

#### Weather Service
```typescript
// src/services/weatherApi.ts
const BASE_URL = 'https://api.open-meteo.com/v1'

export interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

export interface ForecastData {
  current_weather: WeatherData
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation: number[]
  }
}

export const weatherApi = {
  getCurrentWeather: async (
    latitude: number,
    longitude: number
  ): Promise<ForecastData> => {
    const url = `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&timezone=Asia/Bangkok`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch weather')
    return response.json()
  },

  // Bangkok coordinates
  getBangkokWeather: () => weatherApi.getCurrentWeather(13.7563, 100.5018),
}
```

#### Weather Hook
```typescript
// src/hooks/useWeather.ts
import { useState, useEffect } from 'react'
import { weatherApi, ForecastData } from '../services/weatherApi'

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = latitude && longitude
        ? await weatherApi.getCurrentWeather(latitude, longitude)
        : await weatherApi.getBangkokWeather()
      
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [latitude, longitude])

  return { weather, loading, error, refetch: fetchWeather }
}
```

#### Weather Component
```typescript
// app/(tabs)/weather.tsx
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Typography } from '../../src/components/atoms/Typography'
import { Button } from '../../src/components/atoms/Button'
import { Card } from '../../src/components/molecules/Card'
import { useWeather } from '../../src/hooks/useWeather'
import { SPACING, COLORS } from '../../src/constants'

export default function WeatherScreen() {
  const { weather, loading, error, refetch } = useWeather()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Typography variant="body" style={{ marginTop: SPACING.md }}>
          Loading weather data...
        </Typography>
      </View>
    )
  }

  if (error || !weather) {
    return (
      <View style={styles.centered}>
        <Typography variant="h2" style={{ color: COLORS.error }}>
          Error
        </Typography>
        <Typography variant="body">{error}</Typography>
        <Button title="Retry" onPress={refetch} style={{ marginTop: SPACING.md }} />
      </View>
    )
  }

  const { current_weather } = weather

  return (
    <View style={styles.container}>
      <Typography variant="h1" style={styles.title}>
        🌤️ Weather
      </Typography>
      <Typography variant="body" style={styles.subtitle}>
        Bangkok, Thailand
      </Typography>

      <Card
        title={`${current_weather.temperature}°C`}
        description={`Wind Speed: ${current_weather.windspeed} km/h\nUpdated: ${new Date(current_weather.time).toLocaleTimeString()}`}
        onPress={refetch}
        buttonText="Refresh"
        variant="primary"
      />

      <View style={styles.hourlyContainer}>
        <Typography variant="h2" style={{ marginBottom: SPACING.md }}>
          Hourly Forecast
        </Typography>
        {weather.hourly.time.slice(0, 5).map((time, index) => (
          <View key={time} style={styles.hourlyItem}>
            <Typography variant="body">
              {new Date(time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
            <Typography variant="h3">
              {weather.hourly.temperature_2m[index]}°C
            </Typography>
            <Typography variant="caption">
              {weather.hourly.precipitation[index]}mm
            </Typography>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: SPACING.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  hourlyContainer: {
    marginTop: SPACING.xl,
  },
  hourlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
})
```

---

### 3. 💰 Cryptocurrency Prices (CoinGecko)

#### Crypto Service
```typescript
// src/services/cryptoApi.ts
const BASE_URL = 'https://api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export const cryptoApi = {
  getTopCoins: async (limit = 10): Promise<CryptoPrice[]> => {
    const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch crypto prices')
    return response.json()
  },

  getCoinPrice: async (coinId: string): Promise<{ usd: number }> => {
    const url = `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch price')
    const data = await response.json()
    return data[coinId]
  },
}
```

#### Crypto Hook
```typescript
// src/hooks/useCrypto.ts
import { useState, useEffect } from 'react'
import { cryptoApi, CryptoPrice } from '../services/cryptoApi'

export function useCrypto(limit = 10) {
  const [coins, setCoins] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoins = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cryptoApi.getTopCoins(limit)
      setCoins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchCoins, 30000)
    return () => clearInterval(interval)
  }, [limit])

  return { coins, loading, error, refetch: fetchCoins }
}
```

---

### 4. 🎨 Generic API Client Pattern

```typescript
// src/services/apiClient.ts
export class ApiClient {
  constructor(private baseUrl: string) {}

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Usage
export const jsonPlaceholderClient = new ApiClient(
  'https://jsonplaceholder.typicode.com'
)

export const weatherClient = new ApiClient('https://api.open-meteo.com/v1')
```

---

### 5. 🔄 Generic Hook Pattern

```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react'

export function useApi<T>(
  apiFunction: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Usage
const { data: posts } = useApi(() => jsonPlaceholderApi.getPosts())
const { data: weather } = useApi(() => weatherApi.getBangkokWeather())
```

---

## 📝 Integration Checklist

- [ ] Install dependencies
- [ ] Create API service files
- [ ] Create custom hooks
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Add pull-to-refresh
- [ ] Test with real API
- [ ] Handle offline scenarios
- [ ] Add API response caching
- [ ] Setup environment variables

---

## 🚀 Next Steps

1. เลือก API service ที่ต้องการใช้
2. สร้าง service file ตามตัวอย่าง
3. สร้าง custom hook
4. ใช้งานใน component
5. Test และ handle edge cases
6. Deploy!
