-- สร้างฐานข้อมูล
CREATE DATABASE testdb;

-- เชื่อมต่อกับฐานข้อมูล testdb
\c testdb;

-- สร้างตาราง users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูลทดสอบ
INSERT INTO users (name, email) VALUES
  ('สมชาย ใจดี', 'somchai@example.com'),
  ('สมหญิง รักสนุก', 'somying@example.com'),
  ('ประยุทธ์ มั่นคง', 'prayut@example.com'),
  ('วิภา สวยงาม', 'wipa@example.com'),
  ('ธนา รวยมาก', 'thana@example.com')
ON CONFLICT (email) DO NOTHING;

-- แสดงข้อมูลทั้งหมด
SELECT * FROM users;
