import api from './api';

export interface RegisterRequest {
  sisiId: string;
  password: string;
  roles?: string[];
}

export interface LoginRequest {
  sisiId: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  sisiId: string;
  token: string;
  roles: string[];
}

export interface UserRoleUpdateRequest {
  sisiId: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  sisiId: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export const AuthService = {
  // Хэрэглэгч бүртгэх
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Нэвтрэх
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Токен болон хэрэглэгчийн мэдээллийг хадгалах
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Гарах
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Токеноос хэрэглэгчийн мэдээлэл авах
  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Хэрэглэгчийн роль шинэчлэх
  updateUserRoles: async (data: { sisiId: string; roles: string[] }): Promise<AuthResponse> => {
    try {
      const response = await api.put<AuthResponse>('/auth/update-roles', {
        sisiId: data.sisiId,
        roles: data.roles
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user roles:', error);
      throw error;
    }
  },

  // Хэрэглэгчид роль нэмэх
  addUserRole: async (sisiId: string, role: string): Promise<AuthResponse> => {
    const response = await api.put<AuthResponse>(`/auth/add-role?sisiId=${sisiId}&role=${role}`);
    return response.data;
  },

  // Хэрэглэгчээс роль хасах
  removeUserRole: async (sisiId: string, role: string): Promise<AuthResponse> => {
    const response = await api.put<AuthResponse>(`/auth/remove-role?sisiId=${sisiId}&role=${role}`);
    return response.data;
  },

  // Нууц үг солих
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/auth/users');
    return response.data;
  },

  // Хэрэглэгч устгах
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/auth/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default AuthService; 