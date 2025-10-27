# Email Testing Guide

## ❌ Problem: "Email address is invalid"

Supabase ตรวจสอบว่า email domain เป็น **domain จริง** หรือไม่

### ❌ Email ที่ใช้ไม่ได้:
- `test@example.com` ❌ (example.com ไม่ใช่ domain จริง)
- `user@test.com` ❌ (test.com ไม่ใช่ domain จริง)  
- `demo@demo.com` ❌ (demo.com ไม่ใช่ domain จริง)
- `abc@xyz.com` ❌ (ถ้า xyz.com ไม่มีจริง)

---

## ✅ วิธีแก้: ใช้ Email จริง

### Option 1: ใช้ email ส่วนตัว (แนะนำ)
```
your-email@gmail.com       ✅
your-email@outlook.com     ✅
your-email@hotmail.com     ✅
your-name@company.com      ✅
```

### Option 2: ใช้ Temporary Email Services (สำหรับทดสอบ)

**1. [Mailinator](https://www.mailinator.com/)**
```
ใช้: yourusername@mailinator.com
เช็คที่: https://www.mailinator.com/v4/public/inboxes.jsp?to=yourusername
```
- ✅ ไม่ต้องสมัคร
- ✅ Public inbox (ใครก็เข้าดูได้)
- ✅ ใช้ทดสอบได้ทันที

**2. [Temp Mail](https://temp-mail.org/)**
```
สร้าง email ชั่วคราวได้เลย
```
- ✅ สร้างอัตโนมัติ
- ✅ มีอายุ 10-60 นาที
- ✅ เหมาะสำหรับทดสอบ

**3. [Guerrilla Mail](https://www.guerrillamail.com/)**
```
ใช้: random@sharklasers.com
```
- ✅ ไม่ต้องสมัคร
- ✅ มีอายุ 1 ชั่วโมง

**4. [10 Minute Mail](https://10minutemail.com/)**
```
สร้าง email ที่มีอายุ 10 นาที
```
- ✅ เหมาะสำหรับทดสอบเร็วๆ
- ✅ Auto-generate

---

## 🧪 ตัวอย่างการทดสอบ

### แบบที่ 1: ใช้ Gmail
```
1. เปิด app
2. คลิก Sign Up
3. กรอก:
   Email: yourname@gmail.com
   Password: password123
4. คลิก Sign Up
5. เช็คอีเมลที่ Gmail
6. คลิก verify link
7. กลับมา Sign In
```

### แบบที่ 2: ใช้ Mailinator (รวดเร็ว)
```
1. เปิด app
2. คลิก Sign Up
3. กรอก:
   Email: mytestapp2025@mailinator.com
   Password: password123
4. คลิก Sign Up
5. เปิด browser → https://www.mailinator.com/
6. กรอก inbox: mytestapp2025
7. เปิดอีเมลจาก Supabase
8. คลิก verify link
9. กลับมา Sign In
```

---

## 🔧 สำหรับ Development: ปิด Email Verification

ถ้าต้องการทดสอบโดยไม่ต้อง verify email:

### 1. ไปที่ Supabase Dashboard
```
https://app.supabase.com/
→ เลือก Project: lbcktjrikxtqmrvmsnsc
→ Authentication → Settings
→ Email Auth
```

### 2. ปิด Email Confirmation
```
Enable email confirmations: [ ] OFF
```

### 3. Save

ตอนนี้:
- ✅ Sign Up แล้ว login ได้เลย
- ✅ ไม่ต้องรอ verify
- ✅ ใช้ email อะไรก็ได้ (แต่ต้องเป็น domain จริง)

**⚠️ คำเตือน:** อย่าปิดใน production เพราะไม่ปลอดภัย

---

## 📧 Email Testing Domains (จริง)

Domain ที่ใช้ได้:
```
@gmail.com           ✅
@outlook.com         ✅
@hotmail.com         ✅
@yahoo.com           ✅
@mailinator.com      ✅
@guerrillamail.com   ✅
@sharklasers.com     ✅
@10minutemail.com    ✅
```

Domain ที่ใช้ไม่ได้:
```
@example.com         ❌
@test.com            ❌
@demo.com            ❌
@fake.com            ❌
@localhost.com       ❌
```

---

## 🎯 Quick Fix

**ทันที:** ใช้ Mailinator

```bash
# 1. Sign Up ด้วย:
Email: myapp2025@mailinator.com
Password: password123

# 2. เช็คอีเมลที่:
https://www.mailinator.com/v4/public/inboxes.jsp?to=myapp2025

# 3. คลิก verify link

# 4. Sign In:
Email: myapp2025@mailinator.com
Password: password123
```

---

## 💡 Tips

1. **ใช้ Mailinator สำหรับ development** - ไม่ต้องสมัคร ใช้ได้ทันที
2. **ใช้ Gmail จริงสำหรับ production** - ปลอดภัยกว่า
3. **ปิด email confirmation ระหว่าง development** - ทดสอบได้เร็วขึ้น
4. **เปิด email confirmation ก่อน production** - ป้องกัน spam/fake accounts

---

## ✅ Next Steps

1. ใช้ email จริง เช่น `yourname@gmail.com` หรือ
2. ใช้ Mailinator: `yourname@mailinator.com` หรือ
3. ปิด email confirmation ใน Supabase (ถ้าแค่ทดสอบ)

แล้วลองอีกครั้ง! 🎉
