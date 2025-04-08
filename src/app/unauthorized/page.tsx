'use client';

import { useEffect } from 'react';
// import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// import LockIcon from '@mui/icons-material/Lock';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Хэрэв хэрэглэгч нэвтрээгүй бол login хуудас руу чиглүүлэх
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center w-full max-w-sm">
        <div className="bg-red-500 text-white rounded-full w-20 h-20 flex justify-center items-center mb-6">
          <span className="text-4xl">🔒</span> {/* LockIcon орлуулсан */}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          Хандах эрхгүй
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Танд энэ хуудасруу хандах эрх зөвшөөрөл байхгүй байна. Хэрэв таны бодлоор энэ алдаа мөн бол, администратортай холбогдоно уу.
        </p>

        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/dashboard')}
          >
            Нүүр хуудас руу буцах
          </button>
          <button
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
            onClick={() => router.back()}
          >
            Буцах
          </button>
        </div>
      </div>
    </div>
  );
}