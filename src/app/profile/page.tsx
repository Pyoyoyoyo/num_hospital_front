'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import AuthService from '@/services/auth.service';

const validationSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Одоогийн нууц үгээ оруулна уу'),
  newPassword: yup
    .string()
    .min(6, 'Нууц үг 6-с дээш тэмдэгт байх ёстой')
    .required('Шинэ нууц үгээ оруулна уу'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Нууц үг таарахгүй байна')
    .required('Нууц үгээ баталгаажуулна уу'),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await AuthService.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        });
        enqueueSnackbar('Нууц үг амжилттай солигдлоо', { variant: 'success' });
        handleClosePasswordDialog();
        resetForm();
      } catch (error: any) {
        console.error('Error changing password:', error);
        if (error.response && error.response.status === 400) {
            formik.setFieldError('currentPassword', 'Одоогийн нууц үг буруу байна.');
        } else {
             enqueueSnackbar('Нууц үг солиход алдаа гарлаа', { variant: 'error' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    formik.resetForm();
  };

  const getInitials = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-semibold mb-4">
              {getInitials(user?.sisiId)}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.sisiId}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {user?.roles?.map((role) => (
                <span
                  key={role}
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
            <button
              onClick={handleOpenPasswordDialog}
              className="mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Нууц үг солих
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Хэрэглэгчийн дэлгэрэнгүй мэдээлэл</h2>
            <hr className="border-t border-gray-200 mb-4" />
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-3 text-gray-500">🆔</span>
                <div>
                  <span className="block text-sm font-medium text-gray-600">Хэрэглэгчийн ID</span>
                  <span className="block text-sm text-gray-900">{user?.id ?? '-'}</span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-gray-500">👤</span>
                <div>
                  <span className="block text-sm font-medium text-gray-600">Хэрэглэгчийн нэр</span>
                  <span className="block text-sm text-gray-900">{user?.sisiId ?? '-'}</span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-gray-500">🔑</span>
                <div>
                  <span className="block text-sm font-medium text-gray-600">Эрх</span>
                  <span className="block text-sm text-gray-900">{user?.roles?.map(role => role.replace('ROLE_', '')).join(', ') ?? '-'}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {passwordDialogOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="password-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClosePasswordDialog}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                 <form onSubmit={formik.handleSubmit}>
                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                       <h3 className="text-lg leading-6 font-medium text-gray-900" id="password-modal-title">
                         Нууц үг солих
                       </h3>
                       <div className="mt-4 space-y-4">
                         <div>
                           <label htmlFor="currentPassword" className="sr-only">Одоогийн нууц үг</label>
                           <input
                             type="password"
                             id="currentPassword"
                             placeholder="Одоогийн нууц үг"
                             required
                             className={`mt-1 block w-full px-3 py-2 border ${formik.touched.currentPassword && formik.errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                             {...formik.getFieldProps('currentPassword')}
                           />
                           {formik.touched.currentPassword && formik.errors.currentPassword && (
                             <p className="mt-1 text-sm text-red-600">{formik.errors.currentPassword}</p>
                           )}
                         </div>
                         <div>
                            <label htmlFor="newPassword" className="sr-only">Шинэ нууц үг</label>
                            <input
                             type="password"
                             id="newPassword"
                             placeholder="Шинэ нууц үг"
                             required
                             className={`mt-1 block w-full px-3 py-2 border ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                             {...formik.getFieldProps('newPassword')}
                           />
                           {formik.touched.newPassword && formik.errors.newPassword && (
                             <p className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</p>
                           )}
                         </div>
                          <div>
                           <label htmlFor="confirmPassword" className="sr-only">Нууц үгээ баталгаажуулах</label>
                            <input
                             type="password"
                             id="confirmPassword"
                             placeholder="Нууц үгээ баталгаажуулах"
                             required
                             className={`mt-1 block w-full px-3 py-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                             {...formik.getFieldProps('confirmPassword')}
                           />
                           {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                             <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                           )}
                         </div>
                       </div>
                    </div>
                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                       <button
                         type="submit"
                         disabled={formik.isSubmitting}
                         className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {formik.isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                       </button>
                       <button
                         type="button"
                         onClick={handleClosePasswordDialog}
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
      </div>
    </ProtectedRoute>
  );
} 