'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import AuthorizationService, { PermissionResponse } from '@/services/authorization.service';

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (user) {
        try {
          // Админ эрхтэй бол бүх зөвшөөрлийг харуулна
          if (hasRole('ROLE_ADMIN')) {
            const allPermissions = await AuthorizationService.getAllPermissions();
            setPermissions(allPermissions);
          }
          // Бусад хэрэглэгчид эрхээсээ хамаарч харуулна
          else {
            // Хэрэв роль байвал, тухайн рольтой хамааралтай эрхийг харуулна
            if (user.roles && user.roles.length > 0) {
              const rolePermissions = await Promise.all(
                user.roles.map(role => AuthorizationService.getActivePermissionsByRole(role))
              );
              
              // Давхардлыг арилгаж, нэгтгэх
              const uniquePermissions: PermissionResponse[] = [];
              rolePermissions.forEach(permissionsList => {
                if (permissionsList) {
                  permissionsList.forEach(rp => {
                    if (rp.permission && !uniquePermissions.some(p => p.id === rp.permission.id)) {
                      uniquePermissions.push(rp.permission);
                    }
                  });
                }
              });
              
              setPermissions(uniquePermissions);
            }
          }
        } catch (error) {
          console.error('Error fetching permissions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPermissions();
  }, [user, hasRole]);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-white shadow rounded-lg p-4 flex flex-col h-60">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Хэрэглэгчийн мэдээлэл</h2>
            <hr className="border-t border-gray-200 mb-4" />
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <strong className="font-medium text-gray-900">ID:</strong> {user?.id ?? 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="font-medium text-gray-900">Нэр:</strong> {user?.sisiId ?? 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="font-medium text-gray-900">Эрх:</strong> {user?.roles?.join(', ').replace(/ROLE_/g, '') ?? 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-6 bg-white shadow rounded-lg p-4 flex flex-col min-h-[240px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Таны зөвшөөрлүүд</h2>
            <hr className="border-t border-gray-200 mb-4" />
            
            {loading ? (
              <div className="flex justify-center items-center flex-grow">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : (
              permissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow overflow-y-auto">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="text-base font-semibold text-gray-900 truncate mb-1" title={permission.name}>
                        {permission.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1 h-10 overflow-hidden">
                        {permission.description || 'Тодорхойлолт байхгүй'}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${permission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {permission.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center flex-grow">
                  <p className="text-sm text-gray-500 text-center p-4">Одоогоор танд оноогдсон зөвшөөрөл байхгүй байна.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}