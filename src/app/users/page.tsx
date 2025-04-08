'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useSnackbar } from 'notistack';
import AuthService, { UserResponse } from '@/services/auth.service';

const availableRoles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_DOCTOR', 'ROLE_NURSE'];

export default function UsersPage() {
  const { hasRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
        enqueueSnackbar('Хэрэглэгчдийг авахад алдаа гарлаа', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [enqueueSnackbar]);

  const handleOpenEditDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || []);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleOpenDeleteDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleRolesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedRoles(value);
  };

  const handleUpdateRoles = async () => {
    if (!selectedUser) return;
    try {
      await AuthService.updateUserRoles({
        sisiId: selectedUser.sisiId,
        roles: selectedRoles
      });
      const updatedUsers = await AuthService.getAllUsers();
      setUsers(updatedUsers);
      enqueueSnackbar('Хэрэглэгчийн эрх амжилттай шинэчлэгдлээ', { variant: 'success' });
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating user roles:', error);
      enqueueSnackbar('Хэрэглэгчийн эрх шинэчлэхэд алдаа гарлаа', { variant: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await AuthService.deleteUser(selectedUser.id);
      const updatedUsers = await AuthService.getAllUsers();
      setUsers(updatedUsers);
      enqueueSnackbar('Хэрэглэгч амжилттай устгагдлаа', { variant: 'success' });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar('Хэрэглэгч устгахад алдаа гарлаа', { variant: 'error' });
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Хэрэглэгчийн удирдлага
        </h1>

        {loading ? (
          <div className="flex justify-center items-center p-6">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Хэрэглэгчийн нэр
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Эрх
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.sisiId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEditDialog(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Засах"
                      >
                        <span className="sr-only">Засах</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                      </button>
                      <button
                        onClick={() => handleOpenDeleteDialog(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Устгах"
                      >
                         <span className="sr-only">Устгах</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editDialogOpen && selectedUser && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="edit-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseEditDialog}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="edit-modal-title">
                        Хэрэглэгчийн эрх шинэчлэх
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          <span className="font-semibold">{selectedUser.sisiId}</span> хэрэглэгчийн эрхийг сонгоно уу.
                        </p>
                        <div className="w-full mt-1">
                           <label htmlFor="roles-select" className="block text-sm font-medium text-gray-700 mb-1">
                             Эрхүүд (Олноор сонгох: Cmd/Ctrl + Click)
                           </label>
                           <select
                              id="roles-select"
                              multiple
                              value={selectedRoles}
                              onChange={handleRolesChange}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm h-32"
                            >
                              {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                  {role.replace('ROLE_', '')}
                                </option>
                              ))}
                            </select>
                            <div className="mt-2 flex flex-wrap gap-1">
                               {selectedRoles.map(role => (
                                   <span key={role} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                                       {role.replace('ROLE_', '')}
                                   </span>
                               ))}
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleUpdateRoles}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Хадгалах
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditDialog}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Цуцлах
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteDialogOpen && selectedUser && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="delete-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseDeleteDialog}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                       <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                       </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="delete-modal-title">
                        Хэрэглэгч устгах
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{selectedUser.sisiId}</span> хэрэглэгчийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Устгах
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDeleteDialog}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Цуцлах
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 