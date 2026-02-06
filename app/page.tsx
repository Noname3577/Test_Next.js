import Link from "next/link";
import ResetButton from "./reset-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          PostgreSQL Database Demo
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            href="/users"
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                จัดการข้อมูล Users
              </h2>
              <p className="text-gray-600">
                ดู เพิ่ม แก้ไข และลบข้อมูลผู้ใช้
              </p>
            </div>
          </Link>

          <Link 
            href="/api/test-db"
            target="_blank"
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200 hover:border-green-400"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🔌</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                ทดสอบการเชื่อมต่อ
              </h2>
              <p className="text-gray-600">
                ตรวจสอบสถานะการเชื่อมต่อฐานข้อมูล
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📊 ฟีเจอร์ที่มี:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ เชื่อมต่อ PostgreSQL บน Railway</li>
            <li>✅ แสดงรายการข้อมูลทั้งหมด</li>
            <li>✅ เพิ่มข้อมูลใหม่</li>
            <li>✅ แก้ไขข้อมูล</li>
            <li>✅ ลบข้อมูล</li>
            <li>✅ Real-time updates</li>
          </ul>
        </div>

        <ResetButton />
      </div>
    </div>
  );
}
