# แก้ไขปัญหาการเชื่อมต่อ PostgreSQL บน Railway

## ปัญหา
App ไม่สามารถเชื่อมต่อกับ PostgreSQL ได้เพราะยังไม่ได้เชื่อม 2 services เข้าด้วยกัน

## วิธีแก้ไข

### ขั้นตอนที่ 1: เชื่อมต่อ Services
1. ไปที่ Railway Dashboard
2. คลิกที่ **Test_Next.js** service (app ของคุณ)
3. ไปที่แท็บ **Variables**
4. คลิก **+ New Variable**
5. เลือก **Add Reference** → เลือก **Postgres** → เลือก **DATABASE_URL**
6. คลิก **Add**

### ขั้นตอนที่ 2: Redeploy
หลังจากเพิ่ม DATABASE_URL แล้ว Railway จะ redeploy อัตโนมัติ

### ขั้นตอนที่ 3: ตรวจสอบ
1. รอ deployment เสร็จ (ประมาณ 1-2 นาที)
2. เปิด URL ของ app
3. ไปที่ `/api/test-db` เพื่อทดสอบการเชื่อมต่อ
4. ไปที่ `/users` เพื่อดูข้อมูล

## วิธีเช็คว่าเชื่อมต่อสำเร็จ

### ใน Railway Dashboard:
1. คลิกที่ **Test_Next.js** service
2. ไปแท็บ **Variables**
3. ต้องเห็น `DATABASE_URL` ที่มีค่าเป็น `${{Postgres.DATABASE_URL}}`

### ใน App:
- เปิด `/api/test-db` ต้องเห็น:
```json
{
  "success": true,
  "message": "เชื่อมต่อฐานข้อมูลสำเร็จ! ✅",
  "database": "Railway PostgreSQL",
  "data": [...],
  "rowCount": 5
}
```

## หมายเหตุ
- Railway จะสร้างตารางและข้อมูลทดสอบอัตโนมัติ
- ไม่ต้องตั้งค่าอะไรเพิ่มเติม
- ถ้ายังไม่ได้ ลอง redeploy ใหม่อีกครั้ง
