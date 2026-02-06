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
    
    // สร้างตาราง users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "users" created or already exists');

    // เช็คว่ามีข้อมูลหรือยัง
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const count = parseInt(result.rows[0].count);

    // ถ้ายังไม่มีข้อมูล ให้เพิ่มข้อมูลทดสอบ
    if (count === 0) {
      await pool.query(`
        INSERT INTO users (name, email) VALUES
          ('สมชาย ใจดี', 'somchai@example.com'),
          ('สมหญิง รักสนุก', 'somying@example.com'),
          ('ประยุทธ์ มั่นคง', 'prayut@example.com'),
          ('วิภา สวยงาม', 'wipa@example.com'),
          ('ธนา รวยมาก', 'thana@example.com')
      `);
      console.log('✅ Sample data inserted (5 users)');
    } else {
      console.log(`✅ Database already has ${count} users`);
    }

    isInitialized = true;
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
