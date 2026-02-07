import mysql from 'mysql2/promise';

// แปลง URL string เป็น connection config
function parseConnectionString(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1), // ลบ / ออก
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  } catch (error) {
    console.error('Error parsing connection string:', error);
    throw error;
  }
}

// สร้าง connection pool สำหรับ MySQL
// รองรับทั้ง Railway (MYSQL_URL) และ local development
const pool = mysql.createPool(
  process.env.MYSQL_URL || process.env.DATABASE_URL
    ? parseConnectionString(process.env.MYSQL_URL || process.env.DATABASE_URL!)
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_NAME || 'testdb',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
);

// เริ่มต้นฐานข้อมูลอัตโนมัติเมื่อ import
if (typeof window === 'undefined') {
  // รันเฉพาะฝั่ง server
  import('./init-db').then(({ initDatabase }) => {
    initDatabase().catch(console.error);
  });
}

export default pool;
