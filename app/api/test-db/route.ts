import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    // เริ่มต้นฐานข้อมูล (สร้างตารางและข้อมูลทดสอบ)
    await initDatabase();
    
    // ทดสอบการเชื่อมต่อและดึงข้อมูล
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id');

    return NextResponse.json({
      success: true,
      message: 'เชื่อมต่อฐานข้อมูลสำเร็จ! ✅',
      database: process.env.MYSQL_URL || process.env.DATABASE_URL ? 'Railway MySQL' : 'Local MySQL',
      data: rows,
      rowCount: Array.isArray(rows) ? rows.length : 0
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
