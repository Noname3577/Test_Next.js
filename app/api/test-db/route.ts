import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    // เริ่มต้นฐานข้อมูล (สร้างตารางและข้อมูลทดสอบ)
    await initDatabase();
    
    // ทดสอบการเชื่อมต่อและดึงข้อมูล
    const result = await pool.query('SELECT * FROM users ORDER BY id');

    return NextResponse.json({
      success: true,
      message: 'เชื่อมต่อฐานข้อมูลสำเร็จ! ✅',
      database: process.env.DATABASE_URL ? 'Railway PostgreSQL' : 'Local PostgreSQL',
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล ❌',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
