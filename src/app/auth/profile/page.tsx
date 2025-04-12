'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';

// Нууц үг солих формын валидаци
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
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Хэрэглэгчийн дэлгэрэнгүй мэдээлэл авах
  useEffect(() => {
    async function fetchUserDetails() {
      if (user && user.sisiId) {
        try {
          const details = await UserService.getUserDetailsBySisiId(user.sisiId);
          setUserDetails(details);
        } catch (error: any) {
          console.error('Error fetching user details:', error);
          // Алдаа гарсан тохиолдолд хэрэглэгчид мэдэгдэх
          enqueueSnackbar('Хэрэглэгчийн мэдээлэл татахад алдаа гарлаа', { 
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' }
          });
        } finally {
          setLoading(false);
        }
      } else {

        setLoading(false);
      }
    }
    
    fetchUserDetails();
  }, [user, enqueueSnackbar]);

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

  // Хэрэглэгчийн мэдээллийг шинэчлэх
  const userFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      university: '',
      courseYear: '',
      registerNumber: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (userDetails && userDetails.id) {
          // Мэдээллийг шинэчлэх
          const updatedUser = await UserService.updateUserDetails(userDetails.id, {
            ...userDetails,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            university: values.university,
            courseYear: values.courseYear,
            registerNumber: values.registerNumber,
          });
          
          setUserDetails(updatedUser);
          enqueueSnackbar('Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ', { variant: 'success' });
          setEditMode(false);
        } else if (user && user.sisiId) {
          // Шинээр мэдээлэл үүсгэх
          const newUserDetails = {
            firstName: values.firstName,
            lastName: values.lastName, 
            phoneNumber: values.phoneNumber,
            university: values.university,
            courseYear: values.courseYear,
            registerNumber: values.registerNumber,
            sisiId: user.sisiId 
          };
          
          const createdUser = await UserService.createUserDetails(newUserDetails);
          setUserDetails(createdUser);
          enqueueSnackbar('Хэрэглэгчийн мэдээлэл амжилттай бүртгэгдлээ', { variant: 'success' });
          setEditMode(false);
        }
      } catch (error) {
        console.error('Error updating/creating user details:', error);
        enqueueSnackbar('Мэдээлэл хадгалахад алдаа гарлаа', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Хэрэглэгчийн мэдээлэл ачаалахад userFormik-ийн утгуудыг шинэчлэх
  useEffect(() => {
    if (userDetails) {
      userFormik.setValues({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        phoneNumber: userDetails.phoneNumber || '',
        university: userDetails.university || '',
        courseYear: userDetails.courseYear || '',
        registerNumber: userDetails.registerNumber || '',
      });
    }
  }, [userDetails]);

  const handleToggleEditMode = () => {
    if (editMode) {
      // Цуцлах товч дарсан үед утгуудыг дахин хэрэглэгчийн мэдээллээс авч форм дээр харуулах
      if (userDetails) {
        userFormik.setValues({
          firstName: userDetails.firstName || '',
          lastName: userDetails.lastName || '',
          phoneNumber: userDetails.phoneNumber || '',
          university: userDetails.university || '',
          courseYear: userDetails.courseYear || '',
          registerNumber: userDetails.registerNumber || '',
        });
      }
    }
    setEditMode(!editMode);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Хэрэглэгчийн үндсэн мэдээлэл */}
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

          {/* Хэрэглэгчийн дэлгэрэнгүй мэдээлэл */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Хэрэглэгчийн дэлгэрэнгүй мэдээлэл</h2>
              {userDetails && (
                <button
                  onClick={handleToggleEditMode}
                  className="px-3 py-1 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editMode ? 'Цуцлах' : 'Засах'}
                </button>
              )}
            </div>
            <hr className="border-t border-gray-200 mb-4" />
            
            {loading ? (
              <div className="flex justify-center py-4">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : userDetails ? (
              editMode ? (
                <form onSubmit={userFormik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Хувийн мэдээлэл</h3>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">Овог</label>
                      <input
                        type="text"
                        id="lastName"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('lastName')}
                      />
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">Нэр</label>
                      <input
                        type="text"
                        id="firstName"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('firstName')}
                      />
                    </div>
                    <div>
                      <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-600">Регистрийн дугаар</label>
                      <input
                        type="text"
                        id="registerNumber"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('registerNumber')}
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">Утасны дугаар</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('phoneNumber')}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Сургуулийн мэдээлэл</h3>
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-600">Сургууль</label>
                      <input
                        type="text"
                        id="university"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('university')}
                      />
                    </div>
                    <div>
                      <label htmlFor="courseYear" className="block text-sm font-medium text-gray-600">Курс</label>
                      <input
                        type="text"
                        id="courseYear"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...userFormik.getFieldProps('courseYear')}
                      />
                    </div>
                    <div className="pt-5">
                      <button
                        type="submit"
                        disabled={userFormik.isSubmitting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {userFormik.isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Хэрэглэгчийн хувийн мэдээлэл */}
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Хувийн мэдээлэл</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Овог, Нэр</span>
                          <span className="block text-sm text-gray-900">{userDetails.lastName} {userDetails.firstName}</span>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Регистрийн дугаар</span>
                          <span className="block text-sm text-gray-900">{userDetails.registerNumber}</span>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Хүйс</span>
                          <span className="block text-sm text-gray-900">{userDetails.gender}</span>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.475 48.475 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.921 47.921 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1 .53 0L12.53 3.38l.265.12a.375.375 0 1 1 0 .53l-.265.12-.265.27a.375.375 0 1 1-.53 0l-.265-.27-.265-.12a.375.375 0 1 1 0-.53l.265-.12.265-.27Z" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Нас</span>
                          <span className="block text-sm text-gray-900">{userDetails.age} настай ({userDetails.birthYear} онд төрсөн)</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Хэрэглэгчийн сургуулийн мэдээлэл */}
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Сургуулийн мэдээлэл</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Сургууль</span>
                          <span className="block text-sm text-gray-900">{userDetails.university}</span>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Курс</span>
                          <span className="block text-sm text-gray-900">{userDetails.courseYear} курс</span>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-3 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm font-medium text-gray-600">Утасны дугаар</span>
                          <span className="block text-sm text-gray-900">{userDetails.phoneNumber}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-gray-500 mb-4">Хэрэглэгчийн дэлгэрэнгүй мэдээлэл олдсонгүй. Та мэдээллээ бүртгэнэ үү.</p>
                  <form onSubmit={userFormik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-gray-700 mb-2">Хувийн мэдээлэл</h3>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">Овог</label>
                        <input
                          type="text"
                          id="lastName"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('lastName')}
                        />
                      </div>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">Нэр</label>
                        <input
                          type="text"
                          id="firstName"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('firstName')}
                        />
                      </div>
                      <div>
                        <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-600">Регистрийн дугаар</label>
                        <input
                          type="text"
                          id="registerNumber"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('registerNumber')}
                        />
                      </div>
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">Утасны дугаар</label>
                        <input
                          type="text"
                          id="phoneNumber"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('phoneNumber')}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-gray-700 mb-2">Сургуулийн мэдээлэл</h3>
                      <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-600">Сургууль</label>
                        <input
                          type="text"
                          id="university"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('university')}
                        />
                      </div>
                      <div>
                        <label htmlFor="courseYear" className="block text-sm font-medium text-gray-600">Курс</label>
                        <input
                          type="text"
                          id="courseYear"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...userFormik.getFieldProps('courseYear')}
                        />
                      </div>
                      <div className="pt-5">
                        <button
                          type="submit"
                          disabled={userFormik.isSubmitting}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {userFormik.isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Нууц үг солих цонх */}
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