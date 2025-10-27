# API Integration Guide

## ฟรี Backend-as-a-Service (BaaS) และ API Services

### 1. 🎯 **Supabase** (แนะนำที่สุด)
**ฟรี Forever Plan**
- **Database**: PostgreSQL 500MB
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **Authentication**: Unlimited users
- **Realtime**: Unlimited subscriptions
- **Edge Functions**: 500K invocations/month

**Features:**
- ✅ Authentication (Email, OAuth, Magic Links)
- ✅ PostgreSQL Database with REST API
- ✅ Realtime subscriptions
- ✅ File Storage
- ✅ Edge Functions (Deno)
- ✅ Row Level Security

**เหมาะสำหรับ:** Full-stack apps, CRUD operations, Authentication

```bash
# Installation
pnpm add @supabase/supabase-js
```

**Example Usage:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Authentication
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Database Query
const { data: users } = await supabase
  .from('users')
  .select('*')

// Realtime Subscription
supabase
  .channel('public:users')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'users' },
    (payload) => console.log(payload)
  )
  .subscribe()
```

**Website:** https://supabase.com

---

### 2. 🔥 **Appwrite** (Open Source Alternative)
**ฟรี Cloud Plan**
- **Users**: Unlimited
- **Databases**: 1 database
- **Storage**: 2GB
- **Bandwidth**: 10GB/month
- **Functions**: 750K executions/month

**Features:**
- ✅ Authentication (30+ OAuth providers)
- ✅ Database (NoSQL)
- ✅ Storage
- ✅ Functions (Node.js, Python, Ruby, etc.)
- ✅ Realtime
- ✅ Self-hosted option (ฟรีเต็มที่)

**เหมาะสำหรับ:** Mobile apps, Web apps, Self-hosted projects

```bash
pnpm add appwrite
```

**Example Usage:**
```typescript
import { Client, Account, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID')

const account = new Account(client)
const databases = new Databases(client)

// Authentication
await account.create('unique()', 'email@example.com', 'password')

// Database
const response = await databases.createDocument(
  'DATABASE_ID',
  'COLLECTION_ID',
  'unique()',
  { name: 'John Doe', age: 30 }
)
```

**Website:** https://appwrite.io

---

### 3. 📦 **PocketBase** (Ultra Lightweight)
**ฟรีเต็มที่ (Self-hosted)**
- Single file executable (~15MB)
- SQLite database
- Unlimited everything (self-hosted)
- ไม่มีค่าใช้จ่าย

**Features:**
- ✅ Authentication
- ✅ Database (SQLite)
- ✅ File Storage
- ✅ Realtime subscriptions
- ✅ Admin Dashboard
- ✅ ไม่ต้องเขียน backend code

**เหมาะสำหรับ:** Small to medium apps, Prototypes, Learning

```bash
pnpm add pocketbase
```

**Example Usage:**
```typescript
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

// Authentication
const authData = await pb.collection('users').authWithPassword(
  'test@example.com',
  'password123'
)

// CRUD
const record = await pb.collection('posts').create({
  title: 'Hello World',
  content: 'My first post'
})

// Realtime
pb.collection('posts').subscribe('*', (e) => {
  console.log(e.action) // create, update, delete
  console.log(e.record)
})
```

**Website:** https://pocketbase.io

---

### 4. 🌐 **JSONPlaceholder** (Mock API สำหรับทดสอบ)
**ฟรีเต็มที่**
- Fake REST API
- ไม่ต้อง setup
- ใช้ทดสอบ HTTP requests

**Example Usage:**
```typescript
// GET
const response = await fetch('https://jsonplaceholder.typicode.com/posts')
const posts = await response.json()

// POST
const newPost = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  }
})
```

**Website:** https://jsonplaceholder.typicode.com

---

### 5. 🎨 **Convex** (Reactive Backend)
**ฟรี Starter Plan**
- 1 million function calls/month
- 1GB database storage
- 10GB bandwidth
- Unlimited users

**Features:**
- ✅ Reactive queries (auto-update UI)
- ✅ TypeScript-first
- ✅ Built-in Authentication
- ✅ File Storage
- ✅ Scheduled functions

**เหมาะสำหรับ:** Real-time collaborative apps

```bash
pnpm add convex
```

**Website:** https://www.convex.dev

---

### 6. 🗄️ **Nhost** (GraphQL Backend)
**ฟรี Starter Plan**
- 1GB database
- 1GB file storage
- 10GB bandwidth
- Authentication

**Features:**
- ✅ PostgreSQL + Hasura GraphQL
- ✅ Authentication
- ✅ Storage
- ✅ Serverless Functions

**Website:** https://nhost.io

---

## 📊 Free API Services (สำหรับข้อมูลเฉพาะทาง)

### Public APIs (ไม่ต้องใช้ API Key)
1. **REST Countries** - ข้อมูลประเทศทั้งหมด
   - https://restcountries.com
   ```typescript
   const response = await fetch('https://restcountries.com/v3.1/all')
   ```

2. **Open Meteo** - ข้อมูลสภาพอากาศฟรี
   - https://open-meteo.com
   ```typescript
   const weather = await fetch(
     'https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.52&current_weather=true'
   )
   ```

3. **The Cat API / Dog API** - รูปแมว/สุนัขสุ่ม
   - https://thecatapi.com
   - https://dog.ceo/dog-api

4. **PokeAPI** - ข้อมูล Pokemon
   - https://pokeapi.co
   ```typescript
   const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
   ```

5. **CoinGecko** - ราคา Cryptocurrency
   - https://www.coingecko.com/api
   ```typescript
   const prices = await fetch(
     'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
   )
   ```

---

## 🎯 แนะนำสำหรับ React Native Project

### ตัวเลือกที่ดีที่สุด:

**1. เริ่มต้น/เรียนรู้:**
- ใช้ **JSONPlaceholder** สำหรับทดสอบ HTTP requests
- ใช้ **Public APIs** เพื่อฝึกทำ features จริง

**2. Production App:**
- **Supabase** (ถ้าต้องการ SQL, Authentication, Storage)
- **Appwrite** (ถ้าต้องการ NoSQL, Self-hosted option)
- **PocketBase** (ถ้าต้องการ lightweight, self-hosted)

**3. Real-time App:**
- **Supabase** (PostgreSQL + Realtime)
- **Convex** (Reactive queries)

---

## 📝 Implementation Example

### ตัวอย่างการ Setup Supabase ใน React Native

#### 1. Install Dependencies
```bash
pnpm add @supabase/supabase-js
pnpm add @react-native-async-storage/async-storage
pnpm add react-native-url-polyfill
```

#### 2. Create Supabase Client
```typescript
// src/lib/supabase.ts
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

#### 3. Create Environment Variables
```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Create API Hook
```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
      
      if (error) throw error
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { users, loading, error, refetch: fetchUsers }
}
```

#### 5. Use in Component
```typescript
import { useUsers } from '../hooks/useApi'

export function UsersList() {
  const { users, loading, error } = useUsers()

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error}</Text>

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  )
}
```

---

## 🔐 Best Practices

### 1. Environment Variables
```typescript
// ใช้ .env สำหรับ API keys
// ไม่ commit .env เข้า git
// ใช้ .env.example เป็น template
```

### 2. Error Handling
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Request failed')
  const data = await response.json()
  return data
} catch (error) {
  console.error('API Error:', error)
  // Show user-friendly error message
}
```

### 3. Loading States
```typescript
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)
```

### 4. API Client Pattern
```typescript
// src/api/client.ts
export class ApiClient {
  constructor(private baseUrl: string) {}

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    return response.json()
  }

  async post(endpoint: string, body: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return response.json()
  }
}
```

---

## 📚 Additional Resources

- **React Query / TanStack Query**: Data fetching library
  ```bash
  pnpm add @tanstack/react-query
  ```

- **Axios**: HTTP client alternative to fetch
  ```bash
  pnpm add axios
  ```

- **SWR**: React Hooks for data fetching
  ```bash
  pnpm add swr
  ```

---

## 🎓 Learning Path

1. **Week 1**: ฝึกใช้ JSONPlaceholder + Public APIs
2. **Week 2**: Setup Supabase/Appwrite + Authentication
3. **Week 3**: CRUD operations + Error handling
4. **Week 4**: Realtime features + Optimistic updates

---

## 💡 Tips

- เริ่มจาก **JSONPlaceholder** เพื่อเรียนรู้ HTTP requests
- ใช้ **Supabase** สำหรับ production (มี free tier ดี)
- ใช้ **PocketBase** ถ้าต้องการ self-host (ฟรี 100%)
- ใช้ **React Query** เพื่อจัดการ API state
- เก็บ API keys ใน environment variables เสมอ
- ทดสอบ error cases ทุกครั้ง
- Implement loading และ error states

---

**สรุป:** 
- 🥇 Supabase - Best for most apps (SQL + Auth + Storage + Realtime)
- 🥈 Appwrite - Great NoSQL alternative
- 🥉 PocketBase - Perfect for self-hosting & learning
- 🎯 JSONPlaceholder - Start here for learning
