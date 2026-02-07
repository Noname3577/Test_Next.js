import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT - แก้ไขข้อมูล user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, email } = await request.json();
    const { id } = await params;
    
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    
    // ดึงข้อมูลที่อัพเดท
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - ลบข้อมูล user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // ดึงข้อมูลก่อนลบ
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully',
      data: rows[0]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
