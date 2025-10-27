# Authentication System

## 🔐 Overview

ระบบ Authentication ที่สมบูรณ์ด้วย Supabase รองรับ:
- ✅ Sign Up (สมัครสมาชิก)
- ✅ Sign In (เข้าสู่ระบบ)
- ✅ Sign Out (ออกจากระบบ)
- ✅ Password Reset (รีเซ็ตรหัสผ่าน)
- ✅ Session Persistence (จำการเข้าสู่ระบบ)
- ✅ Protected Routes (ป้องกัน routes)

---

## 🏗️ Architecture

### Components

```
src/
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── screens/
│   └── AuthScreen.tsx          # Login/Signup UI
├── lib/
│   └── supabase.ts            # Supabase client configuration
└── hooks/
    └── useAuth.ts             # (from AuthContext)
```

### Flow
```
App Start
    ↓
Check Session (AuthContext)
    ↓
    ├─ Has Session? → Show App (HomeScreen)
    └─ No Session?  → Show AuthScreen
         ↓
    User Signs In/Up
         ↓
    Session Created → Navigate to App
```

---

## 🚀 Usage

### 1. Basic Authentication

```typescript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, signIn, signOut } = useAuth()

  // Check if user is logged in
  if (!user) {
    return <Text>Please sign in</Text>
  }

  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  )
}
```

### 2. Sign Up

```typescript
const { signUp } = useAuth()

const handleSignUp = async () => {
  const { error } = await signUp('user@example.com', 'password123')
  
  if (error) {
    Alert.alert('Error', error.message)
  } else {
    Alert.alert('Success', 'Check your email to verify your account')
  }
}
```

### 3. Sign In

```typescript
const { signIn } = useAuth()

const handleSignIn = async () => {
  const { error } = await signIn('user@example.com', 'password123')
  
  if (error) {
    Alert.alert('Error', error.message)
  }
  // User is automatically updated in context
}
```

### 4. Sign Out

```typescript
const { signOut } = useAuth()

const handleSignOut = async () => {
  const { error } = await signOut()
  
  if (error) {
    Alert.alert('Error', error.message)
  }
  // User is automatically cleared from context
}
```

### 5. Password Reset

```typescript
const { resetPassword } = useAuth()

const handleReset = async () => {
  const { error } = await resetPassword('user@example.com')
  
  if (error) {
    Alert.alert('Error', error.message)
  } else {
    Alert.alert('Success', 'Check your email for reset instructions')
  }
}
```

---

## 🎨 AuthScreen Features

### Three Modes:
1. **Sign In** - เข้าสู่ระบบ
2. **Sign Up** - สมัครสมาชิก
3. **Reset Password** - รีเซ็ตรหัสผ่าน

### UI Features:
- ✅ Email และ Password validation
- ✅ Loading states
- ✅ Error handling
- ✅ Mode switching
- ✅ Forgot password link
- ✅ Keyboard handling
- ✅ Accessible forms

### Example Usage:
```typescript
import { AuthScreen } from '../screens/AuthScreen'

function App() {
  const { user } = useAuth()
  
  if (!user) {
    return <AuthScreen />
  }
  
  return <MainApp />
}
```

---

## 🔒 Protected Routes Pattern

### Method 1: Component Level
```typescript
function ProtectedScreen() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <ActivityIndicator />
  }
  
  if (!user) {
    return <AuthScreen />
  }
  
  return <ActualContent />
}
```

### Method 2: Higher Order Component
```typescript
// src/components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return <AuthScreen />
  }
  
  return <>{children}</>
}

// Usage
<ProtectedRoute>
  <MySecretScreen />
</ProtectedRoute>
```

---

## 🎯 AuthContext API

### State
- `user: User | null` - Current logged in user
- `session: Session | null` - Current session
- `loading: boolean` - Loading state

### Methods
- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email

### Example
```typescript
const {
  user,           // { id, email, ... } or null
  session,        // Current session
  loading,        // true while checking auth
  signUp,         // async (email, password) => { error }
  signIn,         // async (email, password) => { error }
  signOut,        // async () => { error }
  resetPassword,  // async (email) => { error }
} = useAuth()
```

---

## 📧 Email Configuration (Supabase)

### 1. Enable Email Authentication
Dashboard → Authentication → Providers → Email → Enable

### 2. Configure Email Templates
Dashboard → Authentication → Email Templates

**Available Templates:**
- Confirm signup
- Invite user
- Magic Link
- Change Email Address
- Reset Password

**Recommended Changes:**
```html
<!-- Confirmation Email -->
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

### 3. Setup Redirect URLs
Dashboard → Authentication → URL Configuration

```
Site URL: exp://localhost:8081 (for development)
Redirect URLs: 
  - exp://localhost:8081
  - your-app://auth-callback (for production)
```

---

## 🔐 Supabase Security Setup

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on your tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Create User Profile Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🧪 Testing

### Test Sign Up
```bash
1. Run app: pnpm start
2. Click "Sign Up"
3. Enter email & password
4. Check email for confirmation
5. Click confirmation link
6. Sign in with credentials
```

### Test Sign In
```bash
1. Enter registered email & password
2. Click "Sign In"
3. Should see home screen
4. User email should display
```

### Test Sign Out
```bash
1. While logged in, click "Sign Out"
2. Confirm sign out
3. Should return to AuthScreen
```

### Test Session Persistence
```bash
1. Sign in
2. Close app completely
3. Reopen app
4. Should still be signed in (no need to login again)
```

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- ✅ Check email is verified
- ✅ Check password is correct
- ✅ Check Supabase project is active

### Error: "Failed to fetch"
- ✅ Check internet connection
- ✅ Check `.env` has correct Supabase URL
- ✅ Check Supabase project status

### Email not received
- ✅ Check spam folder
- ✅ Check email is correct
- ✅ Wait a few minutes (can be delayed)
- ✅ Check Supabase email settings

### Session not persisting
- ✅ Check AsyncStorage permissions
- ✅ Check `supabase.ts` has correct config
- ✅ Clear app data and try again

### "User already registered"
- ✅ User already exists with that email
- ✅ Use "Forgot Password" to reset
- ✅ Or sign in with existing account

---

## 🔧 Customization

### Customize AuthScreen Styles
```typescript
// src/screens/AuthScreen.tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#yourColor', // Change background
  },
  input: {
    borderColor: '#yourColor',     // Change input border
  },
  // ... more styles
})
```

### Add OAuth Providers

```typescript
// src/lib/supabase.ts
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  return { data, error }
}

// Enable in Supabase Dashboard:
// Authentication → Providers → Google → Enable
```

### Add User Metadata
```typescript
const { error } = await signUp(email, password, {
  data: {
    full_name: 'John Doe',
    age: 30,
  }
})
```

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## 🎯 Next Steps

1. ✅ Setup authentication (Done!)
2. 📝 Create user profile page
3. 🔐 Add more OAuth providers (Google, GitHub)
4. 📧 Customize email templates
5. 🎨 Add profile image upload
6. 🔔 Add push notifications
7. 📊 Add user analytics

---

**🚀 Authentication is ready to use!**
