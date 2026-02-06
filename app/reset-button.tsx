'use client';

export default function ResetButton() {
  const handleReset = async () => {
    if (!confirm('รีเซ็ตฐานข้อมูล? ข้อมูลเก่าจะถูกลบทั้งหมด')) {
      return;
    }

    try {
      const res = await fetch('/api/reset-db', { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error);
    }
  };

  return (
    <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
      <p className="text-yellow-800 text-center">
        ⚠️ <strong>ถ้าเจอปัญหา:</strong>{' '}
        <button
          onClick={handleReset}
          className="underline font-semibold hover:text-yellow-900 cursor-pointer"
        >
          คลิกที่นี่เพื่อรีเซ็ตฐานข้อมูล
        </button>
      </p>
    </div>
  );
}
