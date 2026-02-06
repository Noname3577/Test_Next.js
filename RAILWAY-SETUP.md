# คู่มือการ Deploy ไปยัง Railway

## ขั้นตอนการ Deploy

### 1. สร้างบัญชี Railway
- ไปที่ https://railway.app/
- สมัครสมาชิกด้วย GitHub account

### 2. สร้าง Project ใหม่
1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เชื่อมต่อ GitHub repository ของคุณ
4. Railway จะ deploy โปรเจคอัตโนมัติ

### 3. เพิ่ม PostgreSQL Database
1. ในหน้า Project คลิก "+ New"
2. เลือก "Database" → "Add PostgreSQL"
3. Railway จะสร้าง database และตั้งค่า `DATABASE_URL` ให้อัตโนมัติ
4. Database จะเชื่อมต่อกับ app ของคุณโดยอัตโนมัติ

### 4. ตั้งค่า Environment Variables (ถ้าจำเป็น)
1. คลิกที่ service ของคุณ
2. ไปที่แท็บ "Variables"
3. Railway จะมี `DATABASE_URL` อยู่แล้ว
4. เพิ่ม variables อื่นๆ ถ้าต้องการ

### 5. สร้างตารางและข้อมูลทดสอบ
หลังจาก deploy สำเร็จ:

1. เปิด URL ของ app คุณ (Railway จะให้ URL มา)
2. ไปที่ `https://your-app.railway.app/api/test-db`
3. API นี้จะสร้างตารางและข้อมูลทดสอบให้อัตโนมัติ

### 6. ทดสอบการทำงาน
- ดูข้อมูล users: `https://your-app.railway.app/api/users`
- ทดสอบ database: `https://your-app.railway.app/api/test-db`

## การเชื่อมต่อ Database จาก Local

ถ้าต้องการเชื่อมต่อ Railway database จาก local:

1. ไปที่ PostgreSQL service ใน Railway
2. คลิกแท็บ "Connect"
3. คัดลอก `DATABASE_URL`
4. เพิ่มใน `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@host.railway.app:port/railway
```

## การดู Database ด้วย Railway Dashboard

1. คลิกที่ PostgreSQL service
2. ไปที่แท็บ "Data"
3. คุณจะเห็น tables และข้อมูลทั้งหมด

## การใช้ Railway CLI (Optional)

ติดตั้ง Railway CLI:
```cmd
npm install -g @railway/cli
```

Login:
```cmd
railway login
```

Link project:
```cmd
railway link
```

Deploy:
```cmd
railway up
```

เปิด app:
```cmd
railway open
```

## ข้อดีของ Railway

✅ Deploy อัตโนมัติจาก GitHub  
✅ PostgreSQL database ฟรี (500 MB)  
✅ SSL/HTTPS อัตโนมัติ  
✅ Environment variables จัดการง่าย  
✅ Logs และ monitoring ในตัว  
✅ ไม่ต้องตั้งค่า Docker หรือ infrastructure  

## Pricing

- **Free Tier**: $5 credit/month (พอสำหรับ hobby projects)
- **Pro**: $20/month (unlimited projects)

## Troubleshooting

### ถ้า build ล้มเหลว
- ตรวจสอบว่า `package.json` มี `build` script
- ดู logs ใน Railway dashboard

### ถ้าเชื่อมต่อ database ไม่ได้
- ตรวจสอบว่า PostgreSQL service ถูกสร้างแล้ว
- ตรวจสอบว่า `DATABASE_URL` ถูกตั้งค่าอัตโนมัติ
- ลองรัน `/api/test-db` เพื่อสร้างตาราง

### ถ้า app ไม่ทำงาน
- ดู logs: คลิก "View Logs" ใน Railway dashboard
- ตรวจสอบว่า port ถูกต้อง (Railway ใช้ `PORT` environment variable)
