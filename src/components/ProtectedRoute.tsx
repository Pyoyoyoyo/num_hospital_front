import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }

    if (!loading && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some(role => hasRole(role));
      if (!hasAccess) {
        router.push('/auth/unauthorized');
      }
    }
  }, [loading, isAuthenticated, router, allowedRoles, hasRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Ачааллаж байна...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(role => hasRole(role));
    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 