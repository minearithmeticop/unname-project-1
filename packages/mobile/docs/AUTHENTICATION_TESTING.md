# Authentication Testing Guide

คู่มือการทดสอบระบบ Authentication (Sign Up, Sign In, Reset Password)

---

## 📋 Pre-requisites

ก่อนทดสอบ ต้องตรวจสอบการตั้งค่า Supabase ก่อน:

### 1. ✅ Check Email Confirmation Settings

1. ไปที่ [Supabase Dashboard](https://app.supabase.com/)
2. เลือก Project: `lbcktjrikxtqmrvmsnsc`
3. ไปที่ **Authentication** → **Settings**
4. ดูที่ **Email Auth**:

```
Enable email confirmations: [✓] หรือ [ ]
```

**สองกรณี:**

#### กรณีที่ 1: Enable email confirmations = ON (แนะนำสำหรับ production)
- User ต้อง verify email ก่อนถึงจะ login ได้
- Supabase จะส่งอีเมล confirmation link
- User กด link → verified → login ได้

#### กรณีที่ 2: Enable email confirmations = OFF (ง่ายสำหรับ development)
- User สมัครแล้ว login ได้เลย ไม่ต้อง verify
- เหมาะสำหรับทดสอบ
- **ระวัง:** อย่าใช้ใน production

### 2. ✅ Check Reset Password Redirect URL

1. ไปที่ **Authentication** → **URL Configuration**
2. ดูที่ **Redirect URLs**
3. ตรวจสอบว่ามี URL นี้:

```
myapp://reset-password
exp://localhost:8081
http://localhost:8081
```

ถ้ายังไม่มี → คลิก **Add URL** แล้วเพิ่ม 3 URL ด้านบน

---

## 🧪 Testing Sign Up

### Test Case 1: Sign Up with Email Confirmation ON

**Steps:**
1. เปิด app → กด "Sign Up"
2. กรอก:
   - Email: `test@example.com`
   - Password: `password123` (อย่างน้อย 6 ตัว)
3. กด "Sign Up"

**Expected Result:**
```
✅ Alert: "Success! 🎉"
"Your account has been created. Please check your email to verify..."
```

**Console Logs:**
```
📝 Attempting to sign up: test@example.com
✅ Sign up successful: {
  user: 'test@example.com',
  needsConfirmation: true
}
```

**Next Steps:**
1. เช็คอีเมล (รวมถึง spam folder)
2. เปิดอีเมลจาก Supabase
3. กด "Confirm your mail"
4. กลับมา app → Sign In

---

### Test Case 2: Sign Up with Email Confirmation OFF

**Steps:**
1. เปิด app → กด "Sign Up"
2. กรอก:
   - Email: `test2@example.com`
   - Password: `password123`
3. กด "Sign Up"

**Expected Result:**
```
✅ Alert: "Success! 🎉"
หน้าจอเปลี่ยนเป็น Sign In mode
```

**Console Logs:**
```
📝 Attempting to sign up: test2@example.com
✅ Sign up successful: {
  user: 'test2@example.com',
  needsConfirmation: false
}
```

**Next Steps:**
1. Sign In เลย (ไม่ต้องรอ verify)

---

### Test Case 3: Sign Up Validation Errors

**Test 3.1: Empty email**
- Email: `` (ว่าง)
- Password: `password123`
- Expected: `❌ Alert: "Please enter your email"`

**Test 3.2: Invalid email format**
- Email: `notanemail`
- Password: `password123`
- Expected: `❌ Alert: "Please enter a valid email address"`

**Test 3.3: Empty password**
- Email: `test@example.com`
- Password: `` (ว่าง)
- Expected: `❌ Alert: "Please enter your password"`

**Test 3.4: Password too short**
- Email: `test@example.com`
- Password: `12345` (5 ตัว)
- Expected: `❌ Alert: "Password must be at least 6 characters long"`

**Test 3.5: Email already exists**
- Email: `test@example.com` (ที่สมัครไปแล้ว)
- Password: `password123`
- Expected: `❌ Alert: "Sign Up Failed: User already registered"`

---

## 🔐 Testing Sign In

### Test Case 4: Sign In Success

**Steps:**
1. เปิด app (ถ้า login อยู่ → logout ก่อน)
2. กรอก:
   - Email: `test@example.com` (ที่ verified แล้ว)
   - Password: `password123`
3. กด "Sign In"

**Expected Result:**
```
✅ ไม่มี Alert
✅ เข้าสู่หน้า Home (มี tabs)
✅ เห็น "Welcome Back! 👋"
✅ เห็น email ที่ login
```

**Console Logs:**
```
🔐 Attempting to sign in: test@example.com
✅ Sign in successful: test@example.com
```

---

### Test Case 5: Sign In with Unverified Email

**Condition:** Email Confirmation = ON

**Steps:**
1. Sign up email ใหม่: `unverified@example.com`
2. ไม่กด verify link
3. ลอง sign in เลย

**Expected Result:**
```
❌ Alert: "Sign In Failed"
"Email not confirmed"
```

---

### Test Case 6: Sign In with Wrong Password

**Steps:**
1. Email: `test@example.com`
2. Password: `wrongpassword`
3. กด "Sign In"

**Expected Result:**
```
❌ Alert: "Sign In Failed"
"Invalid login credentials"
```

---

### Test Case 7: Sign In with Non-existent Email

**Steps:**
1. Email: `notexist@example.com`
2. Password: `password123`
3. กด "Sign In"

**Expected Result:**
```
❌ Alert: "Sign In Failed"
"Invalid login credentials"
```

---

## 🔄 Testing Reset Password

### Test Case 8: Reset Password Success

**Steps:**
1. หน้า Sign In → กด "Forgot password?"
2. กรอก Email: `test@example.com`
3. กด "Send Reset Email"

**Expected Result:**
```
✅ Alert: "Check Your Email 📧"
"Password reset instructions have been sent to your email..."
```

**Console Logs:**
```
🔄 Attempting to reset password for: test@example.com
✅ Reset password email sent successfully
```

**Next Steps:**
1. เช็คอีเมล
2. เปิดอีเมล "Reset Password"
3. กด link ในอีเมล
4. ใส่ password ใหม่
5. กลับมา app → Sign In ด้วย password ใหม่

---

### Test Case 9: Reset Password with Invalid Email

**Steps:**
1. กด "Forgot password?"
2. Email: `notexist@example.com`
3. กด "Send Reset Email"

**Expected Result:**
```
✅ Alert: "Check Your Email 📧"
(Supabase ไม่บอกว่า email ไม่มีจริง เพื่อความปลอดภัย)
```

**Note:** แม้ email ไม่มีจริง Supabase ก็จะแสดงว่าส่งอีเมลสำเร็จ เพื่อป้องกัน email enumeration attack

---

### Test Case 10: Reset Password Validation

**Test 10.1: Empty email**
- Email: `` (ว่าง)
- Expected: `❌ Alert: "Please enter your email"`

**Test 10.2: Invalid email format**
- Email: `notanemail`
- Expected: `❌ Alert: "Please enter a valid email address"`

---

## 🎯 Testing Flow: Complete User Journey

### Scenario 1: New User (Email Confirmation ON)

```
1. Open App
   ↓
2. See Login Screen (no tabs)
   ↓
3. Click "Sign Up"
   ↓
4. Enter: test3@example.com / password123
   ↓
5. Click "Sign Up"
   ↓
6. See Alert: "Success! Please check email..."
   ↓
7. Check email → Click verify link
   ↓
8. Return to app
   ↓
9. Sign In: test3@example.com / password123
   ↓
10. ✅ See Home screen with tabs
```

---

### Scenario 2: Forgot Password

```
1. Open App (logged out)
   ↓
2. Click "Forgot password?"
   ↓
3. Enter: test@example.com
   ↓
4. Click "Send Reset Email"
   ↓
5. Check email → Click reset link
   ↓
6. Enter new password: newpassword123
   ↓
7. Return to app
   ↓
8. Sign In with new password
   ↓
9. ✅ Success!
```

---

## 🐛 Troubleshooting

### Problem 1: ไม่ได้รับอีเมล

**Possible Causes:**
1. อีเมลอยู่ใน spam folder → เช็ค spam
2. SMTP settings ไม่ถูกต้อง → เช็ค Supabase settings
3. Email rate limit → รอ 5 นาที แล้วลองใหม่

**Solution:**
```bash
# ดู logs ใน Supabase Dashboard
Authentication → Logs
```

---

### Problem 2: "Invalid login credentials" แม้ password ถูก

**Possible Causes:**
1. Email ยังไม่ verified (Email Confirmation = ON)
2. Password ผิดจริงๆ
3. Account ถูกปิดการใช้งาน

**Solution:**
1. เช็คว่า verified แล้วหรือยัง
2. ลอง reset password
3. เช็ค Supabase Dashboard → Authentication → Users

---

### Problem 3: Sign Up ไม่ทำงาน

**Console Errors:**
```
❌ Sign up error: {...}
```

**Check:**
1. Supabase URL ถูกต้องมั้ย (ใน `.env`)
2. Anon key ถูกต้องมั้ย (ใน `.env`)
3. Sign ups enabled มั้ย (Supabase Dashboard → Auth Settings)

**Solution:**
```bash
# Restart Expo
pnpm start --clear
```

---

### Problem 4: Reset Password ไม่ทำงาน

**Check:**
1. Redirect URLs ตั้งค่าแล้วมั้ย (Supabase → URL Configuration)
2. Email template ถูกต้องมั้ย (Supabase → Email Templates)

**Solution:**
เพิ่ม redirect URLs:
```
myapp://reset-password
exp://localhost:8081
http://localhost:8081
```

---

## 📊 Expected Console Logs Summary

### Successful Sign Up:
```
📝 Attempting to sign up: user@example.com
✅ Sign up successful: { user: 'user@example.com', needsConfirmation: true }
```

### Successful Sign In:
```
🔐 Attempting to sign in: user@example.com
✅ Sign in successful: user@example.com
```

### Successful Sign Out:
```
🚪 Signing out...
✅ Sign out successful
```

### Successful Reset Password:
```
🔄 Attempting to reset password for: user@example.com
✅ Reset password email sent successfully
```

---

## ✅ Checklist

ก่อนบอกว่า authentication ใช้งานได้:

- [ ] Sign Up ได้ (ได้รับอีเมล confirmation)
- [ ] Verify email ได้ (กดลิงก์ในอีเมลแล้วใช้งานได้)
- [ ] Sign In ได้ (เห็นหน้า Home พร้อม tabs)
- [ ] Sign Out ได้ (กลับไปหน้า login, tabs หาย)
- [ ] Forgot Password ได้ (ได้รับอีเมล reset)
- [ ] Reset Password ได้ (เปลี่ยน password แล้ว login ได้)
- [ ] Validation ทำงาน (แสดง error เมื่อกรอกผิด)
- [ ] Protected routes ทำงาน (ไม่ login = ไม่เห็น tabs)
- [ ] Loading states แสดงถูกต้อง
- [ ] Console logs แสดงครบถ้วน

---

## 🎓 Summary

| Feature | Status | Note |
|---------|--------|------|
| Sign Up | ✅ | ต้องตั้งค่า email confirmation |
| Email Verification | ✅ | เช็ค spam folder |
| Sign In | ✅ | ต้อง verify ก่อน (ถ้าเปิด confirmation) |
| Sign Out | ✅ | ทำงานทั้ง web และ mobile |
| Reset Password | ✅ | ต้องตั้งค่า redirect URLs |
| Validation | ✅ | Email format, password length |
| Protected Routes | ✅ | ไม่ login = ไม่เห็น tabs |
| Loading States | ✅ | แสดงขณะ loading |

---

## 📚 Next Steps

หลังจากทดสอบสำเร็จแล้ว:

1. ✅ ปิด email confirmation (ถ้าต้องการให้ง่ายขึ้น)
2. ✅ ตั้งค่า RLS policies (ดูใน SECURITY.md)
3. ✅ เพิ่ม profile page (แก้ไขข้อมูลผู้ใช้)
4. ✅ เพิ่ม forgot username
5. ✅ เพิ่ม social login (Google, Facebook, etc.)

---

**Happy Testing! 🎉**
