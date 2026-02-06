import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - ดึงข้อมูล users ทั้งหมด
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rowCount 
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - เพิ่ม user ใหม่
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json({
        success: false,
        error: 'กรุณากรอกชื่อและอีเมล'
      }, { status: 400 });
    }
    
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows[0],
      message: 'เพิ่มข้อมูลสำเร็จ ✅'
    });
  } catch (error) {
    // เช็คว่าเป็น duplicate email error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: false,
        error: 'อีเมลนี้มีในระบบแล้ว'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
