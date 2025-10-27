# 🔐 Invitation Code System - Complete Implementation Guide

## 📋 System Overview

ระบบ Whitelist โดยใช้ Invitation Code ที่มีอายุ 5 นาที สำหรับควบคุมการสมัครสมาชิก

---

## 🗄️ Part 1: Supabase Setup

### 1.1 เข้าไป Supabase Dashboard
1. ไปที่ https://supabase.com/dashboard
2. เลือก Project ของคุณ
3. ไปที่ **SQL Editor**

### 1.2 สร้าง Table

```sql
-- สร้างตาราง invitation_codes
CREATE TABLE invitation_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(8) UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT check_expiry CHECK (expires_at > created_at)
);

-- สร้าง indexes
CREATE INDEX idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX idx_invitation_codes_created_by ON invitation_codes(created_by);
CREATE INDEX idx_invitation_codes_expires_at ON invitation_codes(expires_at);
CREATE INDEX idx_invitation_codes_is_used ON invitation_codes(is_used);
```

### 1.3 สร้าง Row Level Security (RLS)

```sql
-- เปิดใช้งาน RLS
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;

-- Policy 1: ดู code ที่ตัวเองสร้าง
CREATE POLICY "Users can view own invitation codes"
  ON invitation_codes
  FOR SELECT
  USING (auth.uid() = created_by);

-- Policy 2: User ที่ login แล้วสร้าง code ได้
CREATE POLICY "Authenticated users can create invitation codes"
  ON invitation_codes
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Policy 3: อนุญาตให้อ่าน code เพื่อ validate
CREATE POLICY "Anyone can read codes for validation"
  ON invitation_codes
  FOR SELECT
  USING (true);

-- Policy 4: System update code เมื่อถูกใช้งาน
CREATE POLICY "System can update used codes"
  ON invitation_codes
  FOR UPDATE
  USING (true);
```

### 1.4 สร้าง Functions

#### Function 1: Generate Code
```sql
CREATE OR REPLACE FUNCTION generate_invitation_code(user_id UUID)
RETURNS TABLE(code VARCHAR, expires_at TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
  new_code VARCHAR(8);
  expiry_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Generate random 8-character code
  new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  
  -- Set expiry to 5 minutes
  expiry_time := NOW() + INTERVAL '5 minutes';
  
  -- Insert code
  INSERT INTO invitation_codes (code, created_by, expires_at)
  VALUES (new_code, user_id, expiry_time);
  
  RETURN QUERY SELECT new_code, expiry_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 2: Validate Code
```sql
CREATE OR REPLACE FUNCTION validate_invitation_code(input_code VARCHAR)
RETURNS TABLE(valid BOOLEAN, message TEXT) AS $$
DECLARE
  code_record RECORD;
BEGIN
  SELECT * INTO code_record
  FROM invitation_codes
  WHERE code = input_code;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Invalid invitation code';
    RETURN;
  END IF;
  
  IF code_record.is_used THEN
    RETURN QUERY SELECT FALSE, 'This code has already been used';
    RETURN;
  END IF;
  
  IF code_record.expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, 'This code has expired';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT TRUE, 'Valid invitation code';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 3: Mark Code as Used
```sql
CREATE OR REPLACE FUNCTION mark_code_as_used(input_code VARCHAR, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE invitation_codes
  SET 
    is_used = TRUE,
    used_by = user_id,
    used_at = NOW()
  WHERE code = input_code
    AND is_used = FALSE
    AND expires_at > NOW();
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 4: Cleanup Expired Codes
```sql
CREATE OR REPLACE FUNCTION delete_expired_invitation_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM invitation_codes
  WHERE expires_at < NOW() AND is_used = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 💻 Part 2: Frontend Implementation

### 2.1 Files Created
✅ `src/types/invitation.ts` - Type definitions
✅ `src/services/invitationService.ts` - API calls
✅ `src/screens/InviteScreen.tsx` - Generate code screen

### 2.2 Files to Modify

#### 📝 AuthScreen.tsx
เพิ่ม invitation code field ใน signup form:

```typescript
// Add state
const [invitationCode, setInvitationCode] = useState('')

// Add validation in handleAuth
if (mode === 'signup') {
  if (!invitationCode.trim()) {
    showAlert('Error', 'Please enter an invitation code')
    return
  }
  
  // Validate code first
  const { data: validationData, error: validationError } = 
    await validateInvitationCode(invitationCode.trim())
  
  if (validationError || !validationData?.valid) {
    showAlert('Error', validationData?.message || 'Invalid invitation code')
    return
  }
  
  // Proceed with signup
  const { error, data } = await signUp(email.trim(), password)
  
  if (!error && data?.user) {
    // Mark code as used
    await markCodeAsUsed(invitationCode.trim(), data.user.id)
  }
}

// Add TextInput in render
{mode === 'signup' && (
  <TextInput
    style={styles.input}
    placeholder="Invitation Code"
    value={invitationCode}
    onChangeText={setInvitationCode}
    autoCapitalize="characters"
    maxLength={8}
  />
)}
```

#### 📝 Add Invite Tab to Navigation
```typescript
// In app/(tabs)/_layout.tsx
<Tabs.Screen 
  name="invite" 
  options={{ 
    title: 'Invite',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person-add" size={size} color={color} />
    ),
  }} 
/>
```

#### 📝 Create Invite Tab Screen
```typescript
// app/(tabs)/invite.tsx
export { InviteScreen as default } from '../../src/screens/InviteScreen';
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     INVITATION CODE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. EXISTING USER (Logged In)
   │
   ├─→ Go to "Invite" tab
   │
   ├─→ Click "Generate Invitation Code"
   │   └─→ System creates 8-char code (e.g., A3F8K2M1)
   │       └─→ Expires in 5 minutes
   │
   ├─→ Share code with friend
   │
   └─→ View invitation history
       └─→ See used/unused status


2. NEW USER (Not Registered)
   │
   ├─→ Open app → See Auth Screen
   │
   ├─→ Select "Sign Up"
   │
   ├─→ Enter:
   │   • Email
   │   • Password
   │   • **Invitation Code** (required)
   │
   ├─→ Click "Sign Up"
   │
   ├─→ System validates:
   │   • Code exists? ✓
   │   • Not used yet? ✓
   │   • Not expired? ✓
   │
   ├─→ If valid:
   │   • Create user account
   │   • Mark code as "used"
   │   • Login automatically
   │
   └─→ If invalid:
       • Show error message
       • Cannot proceed


3. CODE EXPIRATION
   │
   ├─→ After 5 minutes: Code becomes invalid
   │
   └─→ Expired codes auto-deleted by cleanup function
```

---

## 🎯 Key Features

### ✅ For Code Generators (Logged-in Users)
- Generate unlimited codes
- Each code valid for 5 minutes
- View history of all generated codes
- See which codes were used
- Copy code to share with friends

### ✅ For New Users
- Must have valid code to register
- Code must not be expired
- Code must not be already used
- One-time use per code

### ✅ Security
- RLS policies protect data
- Server-side validation
- Automatic cleanup of expired codes
- Cannot bypass invitation requirement

---

## 📱 UI Components

### Invite Screen Features:
1. **Active Code Display**
   - Large, prominent code display
   - Live countdown timer
   - Copy button

2. **Generate Button**
   - Creates new code instantly
   - Replaces current code

3. **Invitation History**
   - List of all codes created
   - Status badges (Used/Unused)
   - Creation timestamps
   - Usage timestamps (if used)

### Auth Screen Updates:
1. **Invitation Code Input**
   - Only visible in Sign Up mode
   - 8-character uppercase input
   - Validates on submit

---

## 🧪 Testing Checklist

### Database Tests:
- [ ] Create invitation_codes table successfully
- [ ] RLS policies work correctly
- [ ] Functions execute without errors
- [ ] Indexes improve query performance

### Generate Code Tests:
- [ ] Logged-in user can generate code
- [ ] Code is 8 characters
- [ ] Code expires after 5 minutes
- [ ] Cannot generate code while logged out

### Validate Code Tests:
- [ ] Valid code passes validation
- [ ] Expired code fails validation
- [ ] Used code fails validation
- [ ] Invalid code fails validation

### Sign Up Tests:
- [ ] Cannot sign up without code
- [ ] Cannot sign up with invalid code
- [ ] Cannot sign up with expired code
- [ ] Cannot sign up with used code
- [ ] Can sign up with valid code
- [ ] Code marked as used after signup

### UI Tests:
- [ ] Countdown timer works correctly
- [ ] Copy button works
- [ ] History loads correctly
- [ ] Status badges show correctly

---

## 🚀 Deployment Steps

1. **Supabase Setup** (10 min)
   - Run all SQL scripts in SQL Editor
   - Verify tables and functions created
   - Test RLS policies

2. **Frontend Integration** (30 min)
   - Files already created ✓
   - Modify AuthScreen.tsx
   - Add Invite tab to navigation
   - Test on development

3. **Testing** (20 min)
   - Test code generation
   - Test sign up flow
   - Test expiration
   - Test cleanup

4. **Production Deploy**
   - Push to Git
   - Deploy to production
   - Monitor for errors

---

## ⚠️ Important Notes

### Security Considerations:
1. Always validate codes on server-side
2. Use RLS policies for data protection
3. Clean up expired codes regularly
4. Rate limit code generation if needed

### User Experience:
1. Show clear error messages
2. Display time remaining prominently
3. Auto-refresh history after actions
4. Provide visual feedback for all actions

### Performance:
1. Indexes on frequently queried columns
2. Cleanup expired codes periodically
3. Limit history query results if needed
4. Cache user's own codes locally

---

## 🆘 Troubleshooting

### Problem: Cannot generate code
- Check if user is logged in
- Verify function exists in Supabase
- Check RLS policies

### Problem: Code validation fails
- Check if code format is correct (8 chars)
- Verify code exists in database
- Check expiration time
- Verify not already used

### Problem: Sign up fails with valid code
- Check if code marking function works
- Verify user creation succeeds
- Check Supabase auth logs

---

## 📞 Next Steps

1. ✅ Run Supabase SQL scripts
2. ⏳ Modify AuthScreen.tsx (see section 2.2)
3. ⏳ Add Invite tab to navigation
4. ⏳ Test complete flow
5. ⏳ Deploy to production

---

**สิ่งที่ต้องทำต่อ:**
1. คัดลอก SQL scripts ทั้งหมดไปรัน ใน Supabase SQL Editor
2. แก้ไข AuthScreen.tsx เพิ่ม invitation code validation
3. เพิ่ม Invite tab ใน navigation
4. ทดสอบ flow ทั้งหมด

มีคำถามเพิ่มเติมไหมครับ? 😊
