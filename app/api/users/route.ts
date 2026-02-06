import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - ดึงข้อมูล users ทั้งหมด
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return NextResponse.json({ success: true, data: result.rows });
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
    
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
