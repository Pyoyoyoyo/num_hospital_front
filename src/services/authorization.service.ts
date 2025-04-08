import api from './api';

export interface PermissionRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionRequest {
  role: string;
  permissionId: string;
  isActive?: boolean;
}

export interface RolePermissionResponse {
  id: string;
  role: string;
  permission: PermissionResponse;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AuthorizationService = {
  // Зөвшөөрөл үүсгэх
  createPermission: async (data: PermissionRequest): Promise<PermissionResponse> => {
    const response = await api.post<PermissionResponse>('/authorization/permissions', data);
    return response.data;
  },

  // Зөвшөөрөл авах
  getPermission: async (id: string): Promise<PermissionResponse> => {
    const response = await api.get<PermissionResponse>(`/authorization/permissions/${id}`);
    return response.data;
  },

  // Бүх зөвшөөрлүүдийг авах
  getAllPermissions: async (): Promise<PermissionResponse[]> => {
    const response = await api.get<PermissionResponse[]>('/authorization/permissions');
    return response.data;
  },

  // Зөвшөөрөл шинэчлэх
  updatePermission: async (id: string, data: PermissionRequest): Promise<PermissionResponse> => {
    const response = await api.put<PermissionResponse>(`/authorization/permissions/${id}`, data);
    return response.data;
  },

  // Зөвшөөрөл устгах
  deletePermission: async (id: string): Promise<void> => {
    await api.delete(`/authorization/permissions/${id}`);
  },

  // Рольд зөвшөөрөл оноох
  assignPermissionToRole: async (data: RolePermissionRequest): Promise<RolePermissionResponse> => {
    const response = await api.post<RolePermissionResponse>('/authorization/role-permissions', data);
    return response.data;
  },

  // Ролийн зөвшөөрлүүдийг авах
  getPermissionsByRole: async (role: string): Promise<RolePermissionResponse[]> => {
    const response = await api.get<RolePermissionResponse[]>(`/authorization/role-permissions/role/${role}`);
    return response.data;
  },

  // Ролийн идэвхтэй зөвшөөрлүүдийг авах
  getActivePermissionsByRole: async (role: string): Promise<RolePermissionResponse[]> => {
    const response = await api.get<RolePermissionResponse[]>(`/authorization/role-permissions/role/${role}/active`);
    return response.data;
  },

  // Роль-зөвшөөрөл холбоос шинэчлэх
  updateRolePermission: async (id: string, data: RolePermissionRequest): Promise<RolePermissionResponse> => {
    const response = await api.put<RolePermissionResponse>(`/authorization/role-permissions/${id}`, data);
    return response.data;
  },

  // Роль-зөвшөөрөл холбоос устгах
  deleteRolePermission: async (id: string): Promise<void> => {
    await api.delete(`/authorization/role-permissions/${id}`);
  }
};

export default AuthorizationService; 