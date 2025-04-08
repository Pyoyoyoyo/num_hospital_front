import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// import { CircularProgress, Box } from '@mui/material'; // MUI компонент устгав

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    // Хэрэв зөвшөөрөгдсөн роль байвал шалгана
    if (!loading && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some(role => hasRole(role));
      if (!hasAccess) {
        router.push('/unauthorized');
      }
    }
  }, [loading, isAuthenticated, router, allowedRoles, hasRole]);

  if (loading) {
    // MUI Box болон CircularProgress-ийг Tailwind-ээр солив
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Ачааллаж байна...</p>
        {/* Хэрэв spinner хэрэгтэй бол доорхийг ашиглаж болно */}
        {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div> */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // Хэрэглэгч нэвтрээгүй бол login хуудас руу шилжих тул энд юу ч харуулахгүй
    return null;
  }

  // Зөвшөөрөл шалгах
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(role => hasRole(role));
    if (!hasAccess) {
      // Эрхгүй бол unauthorized хуудас руу шилжих тул энд юу ч харуулахгүй
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 