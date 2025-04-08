'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useSnackbar } from 'notistack';
import AuthorizationService, { PermissionResponse } from '@/services/authorization.service';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Зөвшөөрлийн нэр оруулна уу'),
  description: yup.string(),
  isActive: yup.boolean(),
});

export default function PermissionsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState<PermissionResponse | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (selectedPermission) {
          const updatedPermission = await AuthorizationService.updatePermission(selectedPermission.id, values);
          setPermissions(permissions.map(permission => permission.id === selectedPermission.id ? updatedPermission : permission));
          enqueueSnackbar('Зөвшөөрөл амжилттай шинэчлэгдлээ', { variant: 'success' });
        } else {
          const newPermission = await AuthorizationService.createPermission(values);
          setPermissions([...permissions, newPermission]);
          enqueueSnackbar('Зөвшөөрөл амжилттай үүслээ', { variant: 'success' });
        }
        handleCloseDialog();
        resetForm();
      } catch (error) {
        console.error('Error saving permission:', error);
        enqueueSnackbar('Зөвшөөрөл хадгалахад алдаа гарлаа', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await AuthorizationService.getAllPermissions();
        setPermissions(response);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        enqueueSnackbar('Зөвшөөрлүүдийг авахад алдаа гарлаа', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [enqueueSnackbar]);

  const handleCreatePermission = () => {
    setSelectedPermission(null);
    formik.resetForm();
    formik.setFieldValue('isActive', true);
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (permission: PermissionResponse) => {
    setSelectedPermission(permission);
    formik.setValues({
      name: permission.name,
      description: permission.description || '',
      isActive: permission.isActive ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (permission: PermissionResponse) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
    formik.resetForm();
  };

  const handleDeletePermission = async () => {
    if (!selectedPermission) return;
    try {
      await AuthorizationService.deletePermission(selectedPermission.id);
      setPermissions(permissions.filter(permission => permission.id !== selectedPermission.id));
      enqueueSnackbar('Зөвшөөрөл амжилттай устгагдлаа', { variant: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting permission:', error);
      enqueueSnackbar('Зөвшөөрөл устгахад алдаа гарлаа', { variant: 'error' });
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Зөвшөөрлийн удирдлага
          </h1>
          <button
            onClick={handleCreatePermission}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Зөвшөөрөл нэмэх
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тайлбар</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төлөв</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үүсгэсэн</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{permission.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{permission.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={permission.description}>{permission.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {permission.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(permission.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEditDialog(permission)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Засах"
                      >
                        <span className="sr-only">Засах</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                      </button>
                      <button
                        onClick={() => handleOpenDeleteDialog(permission)}
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

        {editDialogOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="permission-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseDialog}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                 <form onSubmit={formik.handleSubmit}>
                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                           <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                              <h3 className="text-lg leading-6 font-medium text-gray-900" id="permission-modal-title">
                                {selectedPermission ? 'Зөвшөөрөл засах' : 'Зөвшөөрөл нэмэх'}
                              </h3>
                              <div className="mt-4 space-y-4">
                                 <div>
                                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">Зөвшөөрлийн нэр <span className="text-red-500">*</span></label>
                                   <input
                                      type="text"
                                      id="name"
                                      className={`mt-1 block w-full px-3 py-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                      {...formik.getFieldProps('name')}
                                   />
                                   {formik.touched.name && formik.errors.name && (
                                      <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                                   )}
                                </div>
                                 <div>
                                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">Тайлбар</label>
                                   <textarea
                                      id="description"
                                      rows={3}
                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      {...formik.getFieldProps('description')}
                                   />
                                 </div>
                                 <div className="flex items-center">
                                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mr-3">Төлөв:</label>
                                   <button
                                    type="button"
                                    className={`${formik.values.isActive ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    role="switch"
                                    aria-checked={formik.values.isActive}
                                    onClick={() => formik.setFieldValue('isActive', !formik.values.isActive)}
                                    {...formik.getFieldProps('isActive')}
                                    id="isActive"
                                  >
                                    <span className="sr-only">Идэвхтэй эсэх</span>
                                    <span
                                      aria-hidden="true"
                                      className={`${formik.values.isActive ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                    />
                                  </button>
                                   <span className={`ml-3 text-sm font-medium ${formik.values.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                      {formik.values.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                                  </span>
                                </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                           type="submit"
                           disabled={formik.isSubmitting}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {formik.isSubmitting ? 'Хадгалж байна...' : (selectedPermission ? 'Шинэчлэх' : 'Нэмэх')}
                        </button>
                        <button
                           type="button"
                           onClick={handleCloseDialog}
                           className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                           Цуцлах
                        </button>
                     </div>
                 </form>
              </div>
            </div>
          </div>
        )}

        {deleteDialogOpen && selectedPermission && (
           <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="delete-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseDialog}></div>
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
                        Зөвшөөрөл устгах
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{selectedPermission.name}</span> зөвшөөрлийг устгахдаа итгэлтэй байна уу?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeletePermission}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Устгах
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDialog}
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