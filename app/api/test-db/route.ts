import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // ทดสอบการเชื่อมต่อ
    const client = await pool.connect();
    
    // สร้างตารางทดสอบ
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // เพิ่มข้อมูลทดสอบ
    await client.query(`
      INSERT INTO users (name, email) 
      VALUES 
        ('สมชาย ใจดี', 'somchai@example.com'),
        ('สมหญิง รักสนุก', 'somying@example.com'),
        ('ประยุทธ์ มั่นคง', 'prayut@example.com')
      ON CONFLICT (email) DO NOTHING
    `);

    // ดึงข้อมูลทั้งหมด
    const result = await client.query('SELECT * FROM users ORDER BY id');
    
    client.release();

    return NextResponse.json({
      success: true,
      message: 'เชื่อมต่อฐานข้อมูลสำเร็จ!',
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
