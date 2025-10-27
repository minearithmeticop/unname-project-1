# Supabase Setup Guide

## 🚀 Quick Start

### 1. สร้าง Supabase Project

1. ไปที่ [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Create new project:
   - Project name: เลือกชื่อที่ต้องการ
   - Database Password: สร้าง password ที่แข็งแรง (เก็บไว้ปลอดภัย!)
   - Region: เลือก Southeast Asia (Singapore) ใกล้ที่สุด

### 2. Get API Keys

1. ไปที่ Project Settings → API
2. Copy 2 ค่านี้:
   - **Project URL**: `https://xxxyyyzz.supabase.co`
   - **anon public key**: `eyJhbGc...` (key ยาวๆ)

⚠️ **คำเตือน:** อย่าใช้ `service_role key` ในแอป! ใช้เฉพาะ `anon key` เท่านั้น

### 3. Setup Environment Variables

```bash
# ใน packages/mobile/
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxyyyzz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Install Dependencies

```bash
cd packages/mobile
pnpm add @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### 5. Verify Setup

สร้างไฟล์ทดสอบ:
```typescript
// app/test-supabase.tsx
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../src/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      setStatus('✅ Supabase connected successfully!')
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{status}</Text>
    </View>
  )
}
```

---

## 🔐 Enable Row Level Security (RLS)

**สำคัญที่สุด!** ต้องเปิด RLS บนทุก table เพื่อความปลอดภัย

### 1. สร้าง Table

```sql
-- SQL Editor ใน Supabase Dashboard

-- สร้าง table ตัวอย่าง
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิด RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### 2. สร้าง Policies

```sql
-- Policy 1: ทุกคนอ่าน posts ได้
CREATE POLICY "Public can view posts"
  ON posts FOR SELECT
  TO public
  USING (true);

-- Policy 2: User สร้าง posts ได้เฉพาะของตัวเอง
CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: User แก้ไข posts ได้เฉพาะของตัวเอง
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: User ลบ posts ได้เฉพาะของตัวเอง
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### 3. Test RLS Policies

```typescript
// Test: ลองสร้าง post
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    title: 'Test Post',
    content: 'This is a test'
  })

// Test: ลองอ่าน posts
const { data: posts } = await supabase
  .from('posts')
  .select('*')

// Test: ลองแก้ไข post คนอื่น (ควรจะ fail)
const { error: updateError } = await supabase
  .from('posts')
  .update({ title: 'Hacked!' })
  .eq('user_id', 'someone-else-id') // ต้อง error!
```

---

## 🔑 Authentication Setup

### 1. Enable Authentication Providers

ไปที่ Authentication → Providers ใน Supabase Dashboard:

- ✅ Email (enabled by default)
- ✅ Magic Links (passwordless)
- ✅ Google OAuth (optional)
- ✅ GitHub OAuth (optional)

### 2. Configure Email Settings

Authentication → Email Templates:
- Customize confirmation emails
- Customize password reset emails
- Set redirect URLs

### 3. Implementation

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }
}
```

---

## 📝 CRUD Operations

### Create
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: 'My Post',
    content: 'Hello World',
    user_id: user.id,
  })
  .select()
  .single()
```

### Read
```typescript
// Get all
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })

// Get one
const { data: post } = await supabase
  .from('posts')
  .select('*')
  .eq('id', postId)
  .single()

// With filters
const { data: userPosts } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .limit(10)
```

### Update
```typescript
const { data, error } = await supabase
  .from('posts')
  .update({
    title: 'Updated Title',
    content: 'Updated content',
  })
  .eq('id', postId)
  .select()
  .single()
```

### Delete
```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
```

---

## 🔄 Realtime Subscriptions

### Enable Realtime

1. ไปที่ Database → Replication
2. Enable replication สำหรับ table ที่ต้องการ

### Subscribe to Changes

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Initial fetch
    fetchPosts()

    // Subscribe to changes
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('Change received!', payload)
          
          if (payload.eventType === 'INSERT') {
            setPosts((current) => [payload.new, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setPosts((current) =>
              current.map((post) =>
                post.id === payload.new.id ? payload.new : post
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setPosts((current) =>
              current.filter((post) => post.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data)
  }

  return { posts, refetch: fetchPosts }
}
```

---

## 📁 Storage (File Uploads)

### 1. Create Storage Bucket

ไปที่ Storage → New bucket:
- Name: `avatars`
- Public: ✅ (ถ้าต้องการให้เข้าถึงได้สาธารณะ)

### 2. Setup Storage Policies

```sql
-- Policy: ทุกคนอ่านได้
CREATE POLICY "Public avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Policy: User อัพโหลดได้เฉพาะของตัวเอง
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: User ลบได้เฉพาะของตัวเอง
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Upload Files

```typescript
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'

async function uploadAvatar() {
  try {
    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (result.canceled) return

    const photo = result.assets[0]
    const fileExt = photo.uri.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    // Convert to blob
    const response = await fetch(photo.uri)
    const blob = await response.blob()

    // Upload
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: `image/${fileExt}`,
        upsert: true,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    console.log('Avatar uploaded:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
  }
}
```

---

## 🧪 Testing

### Test Authentication
```bash
# ใน Supabase Dashboard → Authentication → Users
# สร้าง test user
```

### Test Database Access
```bash
# ใน SQL Editor
SELECT * FROM posts WHERE user_id = 'test-user-id';
```

### Test Policies
```bash
# ลอง query แบบ anonymous user
# ลอง query แบบ authenticated user
# ลอง access ข้อมูลคนอื่น (ต้อง fail)
```

---

## 📚 Next Steps

1. ✅ Setup Supabase project
2. ✅ Configure environment variables
3. ✅ Enable RLS on all tables
4. ✅ Create policies
5. ✅ Implement authentication
6. ✅ Test CRUD operations
7. 📖 Read [SECURITY.md](./SECURITY.md) for best practices
8. 📖 Read [API_EXAMPLES.md](./API_EXAMPLES.md) for more examples

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
- ตรวจสอบไฟล์ `.env` มีค่าครบ
- ตรวจสอบ prefix `EXPO_PUBLIC_` ถูกต้อง
- Restart Expo dev server

### Error: "new row violates row-level security policy"
- RLS enabled แต่ยังไม่มี policies
- สร้าง policies ตาม section "Enable Row Level Security"

### Error: "JWT expired"
- Token หมดอายุ (ปกติ refresh อัตโนมัติ)
- ลอง sign out แล้ว sign in ใหม่

### Files not uploading
- ตรวจสอบ storage policies
- ตรวจสอบ bucket เป็น public หรือไม่
- ตรวจสอบ file size limits

---

## 💡 Pro Tips

1. ใช้ TypeScript types: `npx supabase gen types typescript`
2. Enable logging: `supabase.auth.debug = true`
3. Test RLS ก่อน production
4. Backup database เป็นประจำ
5. Monitor usage ที่ Dashboard → Settings → Usage

---

**🎯 Ready to build!** ตอนนี้คุณพร้อมใช้งาน Supabase แล้ว! 🚀
