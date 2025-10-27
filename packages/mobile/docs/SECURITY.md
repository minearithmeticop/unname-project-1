# 🔐 Security Best Practices

## การจัดการ API Keys และ Secrets อย่างปลอดภัย

### ⚠️ หลักการสำคัญ

**NEVER commit sensitive data to git!**
- ❌ ห้าม commit API keys
- ❌ ห้าม commit passwords
- ❌ ห้าม commit tokens
- ❌ ห้าม commit private keys
- ❌ ห้าม hardcode secrets ในโค้ด

---

## 🛡️ การใช้ Environment Variables

### 1. Setup Environment Variables ใน Expo

#### สร้างไฟล์ `.env`
```bash
# packages/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**สำคัญ:**
- ใช้ prefix `EXPO_PUBLIC_` สำหรับ variables ที่ต้องการใช้ในแอป
- Variables ที่ไม่มี prefix นี้จะใช้ได้เฉพาะใน Node.js เท่านั้น
- Expo จะ inline ค่าเหล่านี้ตอน build time

#### เข้าถึง Environment Variables
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📝 Checklist: ปกป้อง Secrets

### ✅ Git Configuration

1. **ตรวจสอบ `.gitignore`**
```gitignore
# Environment variables
.env
.env.local
.env.development
.env.development.local
.env.test
.env.test.local
.env.production
.env.production.local
.env*.local

# Expo
.expo/
.expo-shared/

# Secrets
secrets/
*.pem
*.key
*.p12
*.keystore
google-services.json
GoogleService-Info.plist
```

2. **สร้าง `.env.example`**
```bash
# .env.example - Safe to commit
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Instructions:
# 1. Copy this file to .env
# 2. Replace with your actual values
# 3. Never commit .env to git
```

3. **ตรวจสอบว่า `.env` ถูก ignore จริง**
```bash
# ใน terminal
cd packages/mobile
git status

# ถ้าเห็น .env ใน untracked files = อันตราย!
# ต้องเพิ่มใน .gitignore ทันที
```

---

## 🔍 ตรวจสอบ Secrets ที่อาจรั่วไหล

### 1. ตรวจสอบ Git History
```bash
# ค้นหาว่ามี secrets รั่วไหลไปใน history หรือไม่
git log --all --full-history --source -- **/.env
git log -S "supabase" --all

# ถ้าเจอ = ต้อง cleanup!
```

### 2. ลบ Secrets ที่รั่วไหลแล้ว (ถ้ามี)
```bash
# วิธีที่ 1: ใช้ BFG Repo-Cleaner (แนะนำ)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env

# วิธีที่ 2: ใช้ git filter-branch (ช้ากว่า)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# หลังจากนั้น force push (อันตราย! ต้องแจ้งทีมก่อน)
git push origin --force --all
```

**⚠️ หลังจากลบ secrets แล้ว:**
- **Rotate (เปลี่ยน) API keys ทันที** ที่ Supabase Dashboard
- Keys เดิมอาจถูกคนอื่นเห็นแล้ว ต้องไม่ใช้งานต่อ

---

## 🎯 Supabase Security Best Practices

### 1. Row Level Security (RLS)

**เปิด RLS เสมอ!** - สำคัญที่สุด
```sql
-- Enable RLS on your tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- ตัวอย่าง: Users สามารถอ่านและแก้ไขข้อมูลตัวเองได้เท่านั้น
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ตัวอย่าง: Posts สาธารณะอ่านได้ทุกคน แต่แก้ไขได้เฉพาะเจ้าของ
CREATE POLICY "Public can view posts"
  ON posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. API Key Types

Supabase มี 2 types of keys:

| Key Type | Use Case | Safe to Expose? |
|----------|----------|----------------|
| **anon (public)** | Client-side apps | ✅ Yes (with RLS) |
| **service_role** | Server-side only | ❌ NEVER expose |

```typescript
// ✅ CORRECT - ใช้ anon key ใน React Native
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! // anon key
)

// ❌ WRONG - ห้ามใช้ service_role key ใน client
const supabase = createClient(
  supabaseUrl,
  serviceRoleKey // อันตราย! bypass RLS
)
```

### 3. Authentication Rules

```typescript
// ✅ CORRECT - ตรวจสอบ authentication ก่อนทำงาน
const { data: user } = await supabase.auth.getUser()
if (!user) {
  throw new Error('Unauthorized')
}

// ใช้ user.id ในการ query
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', user.id) // เฉพาะ posts ของ user นี้

// ❌ WRONG - ไม่ตรวจสอบ authentication
const { data } = await supabase
  .from('posts')
  .select('*') // อันตราย! อาจเห็นข้อมูลทั้งหมด
```

---

## 📱 React Native Specific Security

### 1. Secure Storage สำหรับ Tokens

```bash
# Install secure storage
pnpm add expo-secure-store
```

```typescript
// src/lib/secureStorage.ts
import * as SecureStore from 'expo-secure-store'

export const secureStorage = {
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value)
  },
  
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key)
  },
  
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key)
  },
}

// Use with Supabase
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: secureStorage, // ใช้ secure storage
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

### 2. Network Security

```typescript
// ✅ ใช้ HTTPS เท่านั้น
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
if (!supabaseUrl?.startsWith('https://')) {
  throw new Error('Supabase URL must use HTTPS')
}

// ✅ Validate SSL certificates
// Expo ทำให้โดยอัตโนมัติ แต่ถ้าใช้ custom domain ต้องตรวจสอบ
```

### 3. Code Obfuscation (สำหรับ Production)

```json
// app.json
{
  "expo": {
    "android": {
      "enableProguard": true,
      "enableShrinkResources": true
    },
    "ios": {
      "bitcode": false,
      "buildConfiguration": "Release"
    }
  }
}
```

---

## 🚨 Emergency Response: ถ้า API Key รั่วไหล

### ทำทันที! (ภายใน 5 นาที)

1. **Rotate API Keys ที่ Supabase Dashboard**
   - ไปที่ Settings → API
   - Generate new anon key
   - Update `.env` ด้วย key ใหม่

2. **Review Logs**
   - ตรวจสอบ Supabase logs ว่ามีการใช้งานผิดปกติหรือไม่
   - ดูที่ Authentication → Users (มี users แปลกปลอมไหม)

3. **Enable Additional Security**
   ```sql
   -- Disable anonymous access ชั่วคราว (ถ้าจำเป็น)
   ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
   
   -- Remove all policies ชั่วคราว
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   ```

4. **Notify Team**
   - แจ้งทีมทันที
   - Document สิ่งที่เกิดขึ้น
   - Review และปรับปรุง security process

---

## ✅ Security Checklist

### Development Phase
- [ ] `.env` อยู่ใน `.gitignore`
- [ ] มี `.env.example` สำหรับทีม
- [ ] ไม่มี hardcoded secrets ในโค้ด
- [ ] ใช้ EXPO_PUBLIC_ prefix อย่างถูกต้อง
- [ ] Test ว่า `.env` ไม่ถูก track โดย git

### Database Phase
- [ ] เปิด RLS บนทุก table
- [ ] สร้าง policies ที่เหมาะสม
- [ ] Test policies ด้วย different users
- [ ] ไม่ใช้ service_role key ใน client

### Authentication Phase
- [ ] ใช้ secure storage สำหรับ tokens
- [ ] Implement token refresh
- [ ] Handle authentication errors
- [ ] Logout clears all tokens

### Production Phase
- [ ] Enable code obfuscation
- [ ] Review และ test RLS policies
- [ ] Setup monitoring และ alerts
- [ ] Document security procedures
- [ ] Regular security audits

---

## 📚 Additional Resources

### Tools
- **git-secrets**: Prevent committing secrets
  - https://github.com/awslabs/git-secrets
  
- **truffleHog**: Find secrets in git history
  - https://github.com/trufflesecurity/trufflehog

- **GitGuardian**: Monitor for leaked secrets
  - https://www.gitguardian.com

### Documentation
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Expo Security Docs](https://docs.expo.dev/guides/security/)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)

---

## 💡 Quick Tips

1. **Never screenshot** code with API keys
2. **Never share** `.env` files via Slack/Email
3. **Never commit** `google-services.json` or `GoogleService-Info.plist`
4. **Always rotate** keys after team member leaves
5. **Use different keys** for development/staging/production
6. **Review git history** before making repo public
7. **Enable 2FA** on all service accounts (GitHub, Supabase, etc.)

---

## 🎯 Summary

**3 หลักการสำคัญที่สุด:**
1. ✅ ใช้ `.env` + `.gitignore` เสมอ
2. ✅ เปิด Row Level Security บน Supabase
3. ✅ ใช้ anon key (ไม่ใช่ service_role) ใน client

**ถ้าจำได้เพียง 3 ข้อ จำ 3 ข้อนี้!**
