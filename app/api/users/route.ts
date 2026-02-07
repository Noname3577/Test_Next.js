import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - ดึงข้อมูล users ทั้งหมด
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id');
    return NextResponse.json({ 
      success: true, 
      data: rows,
      count: Array.isArray(rows) ? rows.length : 0
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
    
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    
    // ดึงข้อมูลที่เพิ่งสร้าง
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: rows[0],
      message: 'เพิ่มข้อมูลสำเร็จ ✅'
    });
  } catch (error) {
    // เช็คว่าเป็น duplicate email error
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
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
