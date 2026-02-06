# คู่มือการใช้งาน PostgreSQL Database

## การติดตั้ง PostgreSQL

### Windows
1. ดาวน์โหลด PostgreSQL จาก: https://www.postgresql.org/download/windows/
2. ติดตั้งและจดจำ password ที่ตั้งไว้สำหรับ user `postgres`
3. เพิ่ม PostgreSQL bin directory ใน PATH (ปกติอยู่ที่ `C:\Program Files\PostgreSQL\16\bin`)

### การสร้างฐานข้อมูล

```cmd
# เข้าสู่ PostgreSQL shell
psql -U postgres

# รันคำสั่งใน psql shell
CREATE DATABASE testdb;
\c testdb
```

หรือใช้ไฟล์ SQL script:
```cmd
psql -U postgres -f scripts/init-db.sql
```

## การติดตั้ง Dependencies

```cmd
npm install pg @types/pg
```

## การตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local` ตามการตั้งค่าของคุณ:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## การทดสอบการเชื่อมต่อ

1. รัน development server:
```cmd
npm run dev
```

2. เปิดเบราว์เซอร์ไปที่:
- ทดสอบการเชื่อมต่อและสร้างข้อมูล: http://localhost:3000/api/test-db
- ดูข้อมูล users: http://localhost:3000/api/users

## API Endpoints

### GET /api/test-db
ทดสอบการเชื่อมต่อ สร้างตาราง และเพิ่มข้อมูลทดสอบ

### GET /api/users
ดึงข้อมูล users ทั้งหมด

### POST /api/users
เพิ่ม user ใหม่

Request body:
```json
{
  "name": "ชื่อผู้ใช้",
  "email": "email@example.com"
}
```

## โครงสร้างไฟล์

- `lib/db.ts` - การตั้งค่าการเชื่อมต่อ PostgreSQL
- `app/api/test-db/route.ts` - API สำหรับทดสอบการเชื่อมต่อ
- `app/api/users/route.ts` - API สำหรับจัดการข้อมูล users
- `scripts/init-db.sql` - SQL script สำหรับสร้างฐานข้อมูลและข้อมูลทดสอบ
- `.env.local` - ไฟล์ environment variables
