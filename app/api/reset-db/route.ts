import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    // ลบตารางเก่า
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Dropped old users table');

    // สร้างตารางใหม่
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created new users table');

    // เพิ่มข้อมูลทดสอบ
    await pool.query(`
      INSERT INTO users (name, email) VALUES
        ('สมชาย ใจดี', 'somchai@example.com'),
        ('สมหญิง รักสนุก', 'somying@example.com'),
        ('ประยุทธ์ มั่นคง', 'prayut@example.com'),
        ('วิภา สวยงาม', 'wipa@example.com'),
        ('ธนา รวยมาก', 'thana@example.com')
    `);
    console.log('✅ Inserted sample data');

    // ดึงข้อมูลทั้งหมด
    const result = await pool.query('SELECT * FROM users ORDER BY id');

    return NextResponse.json({
      success: true,
      message: 'รีเซ็ตฐานข้อมูลสำเร็จ! ✅',
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Reset database error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล ❌',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
