import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthService, { AuthResponse, LoginRequest, RegisterRequest } from '@/services/auth.service';
import { SnackbarProvider, useSnackbar } from 'notistack';

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
  isAuthenticated: false,
  hasRole: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Хэрэв local storage-д хэрэглэгчийн мэдээлэл байвал түүнийг ашиглана
    const initAuth = async () => {
      try {
        const storedUser = AuthService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await AuthService.login(data);
      setUser(response);
      enqueueSnackbar('Амжилттай нэвтэрлээ!', { variant: 'success' });
      router.push('/dashboard');
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Нэвтрэх үед алдаа гарлаа', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      await AuthService.register(data);
      enqueueSnackbar('Амжилттай бүртгүүллээ. Одоо нэвтрэх боломжтой!', { variant: 'success' });
      router.push('/login');
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Бүртгүүлэх үед алдаа гарлаа', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
    enqueueSnackbar('Амжилттай гарлаа', { variant: 'info' });
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthProviderWithSnackbar = ({ children }: { children: ReactNode }) => {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <AuthProvider>{children}</AuthProvider>
    </SnackbarProvider>
  );
}; 