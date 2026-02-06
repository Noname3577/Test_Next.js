'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

type SortField = 'id' | 'name' | 'email' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);
  
  // ค้นหาและจัดเรียง
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // กรองและจัดเรียงข้อมูล
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
    );

    // จัดเรียง
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortField, sortOrder]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setUsers([...users, data.data]);
        setFormData({ name: '', email: '' });
        setIsAdding(false);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? data.data : u));
        setEditingId(null);
        setFormData({ name: '', email: '' });
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', email: '' });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">จัดการข้อมูล Users</h1>
          <Link 
            href="/"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {/* ค้นหา */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 font-semibold">🔍 ค้นหา:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาด้วย ID, ชื่อ หรืออีเมล..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-8 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* ฟอร์มเพิ่ม/แก้ไขข้อมูล */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors w-full font-semibold"
            >
              + เพิ่มข้อมูลใหม่
            </button>
          )}

          {(isAdding || editingId) && (
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleAdd} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editingId ? '✏️ แก้ไขข้อมูล' : '➕ เพิ่มข้อมูลใหม่'}
              </h3>
              <div>
                <label className="block text-gray-700 mb-2">ชื่อ:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">อีเมล:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1"
                >
                  {editingId ? 'บันทึก' : 'เพิ่ม'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex-1"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    ชื่อ {getSortIcon('name')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    อีเมล {getSortIcon('email')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    วันที่สร้าง {getSortIcon('created_at')}
                  </th>
                  <th className="px-6 py-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูล'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-mono text-gray-600">#{user.id}</td>
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => startEdit(user)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow text-center">
          <div className="flex justify-center gap-8 text-gray-600">
            <span>
              แสดง: <span className="font-bold text-blue-600">{filteredUsers.length}</span> รายการ
            </span>
            <span>
              ทั้งหมด: <span className="font-bold text-blue-600">{users.length}</span> รายการ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}