'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
          <div className='md:col-span-12 bg-white shadow rounded-lg p-4 flex flex-col h-60'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>
              Хэрэглэгчийн мэдээлэл
            </h2>
            <hr className='border-t border-gray-200 mb-4' />
            <div className='space-y-1'>
              <p className='text-sm text-gray-700'>
                <strong className='font-medium text-gray-900'>Нэр:</strong>{' '}
                {user?.sisiId ?? 'N/A'}
              </p>
              <p className='text-sm text-gray-700'>
                <strong className='font-medium text-gray-900'>Эрх:</strong>{' '}
                {user?.roles?.join(', ').replace(/ROLE_/g, '') ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
