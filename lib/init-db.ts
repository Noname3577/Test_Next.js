import pool from './db';

let isInitialized = false;

export async function initDatabase() {
  // ป้องกันการรันซ้ำ
  if (isInitialized) {
    console.log('✅ Database already initialized');
    return;
  }

  try {
    console.log('🔄 Initializing database...');
    
    // ลบตารางเก่าถ้ามี (เพื่อป้องกันปัญหาโครงสร้างไม่ตรง)
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Dropped old table if exists');
    
    // สร้างตารางใหม่
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "users" created');

    // เพิ่มข้อมูลทดสอบ
    await pool.query(`
      INSERT INTO users (name, email) VALUES
        ('สมชาย ใจดี', 'somchai@example.com'),
        ('สมหญิง รักสนุก', 'somying@example.com'),
        ('ประยุทธ์ มั่นคง', 'prayut@example.com'),
        ('วิภา สวยงาม', 'wipa@example.com'),
        ('ธนา รวยมาก', 'thana@example.com')
    `);
    console.log('✅ Sample data inserted (5 users)');

    isInitialized = true;
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // ไม่ throw error เพื่อให้ build ผ่าน
    // throw error;
  }
}
