# คู่มือการเปลี่ยนไปใช้ MySQL บน Railway

## ขั้นตอนการตั้งค่า

### 1. ลบ PostgreSQL Service (ถ้าต้องการ)
1. ไปที่ Railway Dashboard
2. คลิกที่ **Postgres** service
3. ไปแท็บ **Settings**
4. เลื่อนลงล่างสุด คลิก **Delete Service**

### 2. เพิ่ม MySQL Service
1. ในหน้า Project คลิก **"+ New"**
2. เลือก **Database** → **Add MySQL**
3. Railway จะสร้าง MySQL service ให้อัตโนมัติ

### 3. เชื่อมต่อ MySQL กับ App
1. คลิกที่ **Test_Next.js** service
2. ไปแท็บ **Variables**
3. ลบ `DATABASE_URL` เดิม (ถ้ามี)
4. คลิก **"+ New Variable"**
5. เลือก **"Add Reference"**
6. เลือก **MySQL** → เลือก **MYSQL_URL**
7. คลิก **Add**

### 4. Deploy Code ใหม่
```bash
git add .
git commit -m "Migrate from PostgreSQL to MySQL"
git push
```

Railway จะ redeploy อัตโนมัติ

### 5. ทดสอบการเชื่อมต่อ
1. รอ deployment เสร็จ (1-2 นาที)
2. เปิด URL ของ app
3. ไปที่ `/api/test-db` เพื่อทดสอบ
4. ไปที่ `/users` เพื่อดูข้อมูล

## ตรวจสอบว่าเชื่อมต่อสำเร็จ

### ใน Railway Dashboard:
1. คลิกที่ **Test_Next.js** service
2. ไปแท็บ **Variables**
3. ต้องเห็น `MYSQL_URL = ${{MySQL.MYSQL_URL}}`

### ใน App:
เปิด `/api/test-db` ต้องเห็น:
```json
{
  "success": true,
  "message": "เชื่อมต่อฐานข้อมูลสำเร็จ! ✅",
  "database": "Railway MySQL",
  "data": [...],
  "rowCount": 5
}
```

## ความแตกต่างระหว่าง PostgreSQL และ MySQL

### PostgreSQL:
- `SERIAL` → Auto increment
- `$1, $2` → Placeholders
- `RETURNING *` → คืนค่าหลัง INSERT/UPDATE

### MySQL:
- `AUTO_INCREMENT` → Auto increment
- `?, ?` → Placeholders
- ต้อง SELECT หลัง INSERT/UPDATE

## Local Development

### ติดตั้ง MySQL:
- Windows: https://dev.mysql.com/downloads/mysql/
- หรือใช้ XAMPP/WAMP

### ตั้งค่า `.env.local`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=testdb
DB_USER=root
DB_PASSWORD=your_password
```

### สร้างฐานข้อมูล:
```sql
CREATE DATABASE testdb;
```

## Troubleshooting

### ถ้า build ล้มเหลว:
- ตรวจสอบว่า `mysql2` ถูกติดตั้งแล้ว
- ดู logs ใน Railway dashboard

### ถ้าเชื่อมต่อไม่ได้:
- ตรวจสอบว่า `MYSQL_URL` ถูกตั้งค่าแล้ว
- ลอง redeploy ใหม่
- เปิด `/api/reset-db` เพื่อรีเซ็ตฐานข้อมูล

## ข้อดีของ MySQL

✅ เร็วกว่าสำหรับ read-heavy workloads  
✅ ใช้ memory น้อยกว่า  
✅ Setup ง่ายกว่า  
✅ รองรับ JSON data type  
✅ Community support กว้างขวาง  
