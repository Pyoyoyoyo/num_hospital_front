'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/auth/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-700 tracking-tight mb-4">
          NUM HOSPITAL
        </h1>
        <p className="mt-4 max-w-xl text-lg sm:text-xl text-gray-600">
          Эмнэлгийн үйлчилгээний системд тавтай морил. Үйлчилгээг авахын тулд нэвтрэх эсвэл бүртгүүлнэ үү.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => router.push('/auth/register')}
            className="px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
          >
            Бүртгүүлэх
          </button>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Онцлог шинж чанарууд</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Хэрэглэгчийн удирдлага</h3>
              <p className="text-blue-100 flex-grow">Хэрэглэгчийн эрх, зөвшөөрлийг хялбархан удирдах боломжтой.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Аюулгүй байдал</h3>
              <p className="text-pink-100 flex-grow">JWT токен ашиглан API-уудын аюулгүй байдлыг хангаж, эрх зөвшөөрлийг удирдах боломжтой.</p>
            </div>
            <div className="bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-lg rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Микросервис архитектур</h3>
              <p className="text-teal-100 flex-grow">API Gateway, Auth Service, Authorization Service гэсэн микросервис хэсгүүдээс бүрддэг.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
