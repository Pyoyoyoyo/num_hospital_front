'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useSnackbar } from 'notistack';
import UserService from '@/services/user.service';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object({
  sisiId: yup
    .string()
    .required('Хэрэглэгчийн нэр оруулна уу'),
  firstName: yup
    .string()
    .required('Нэр оруулна уу'),
  lastName: yup
    .string()
    .required('Овог оруулна уу'),
  registerNumber: yup
    .string()
    .matches(/^[А-ӨЁҮЖ]{2}\d{8}$/, 'Регистрийн дугаар буруу байна (жишээ: ФБ99112233)')
    .required('Регистрийн дугаар оруулна уу'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{8}$/, 'Утасны дугаар 8 оронтой байх ёстой')
    .required('Утасны дугаар оруулна уу'),
  university: yup
    .string()
    .required('Сургууль оруулна уу'),
  courseYear: yup
    .number()
    .required('Курс оруулна уу')
    .min(1, 'Курс 1-ээс их байх ёстой')
    .max(7, 'Курс 7-оос бага байх ёстой'),
});

export default function RegisterPatientPage() {
  const { hasRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      sisiId: '',
      firstName: '',
      lastName: '',
      registerNumber: '',
      phoneNumber: '',
      university: '',
      courseYear: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await UserService.createUserDetails(values);
        enqueueSnackbar('Хэрэглэгч амжилттай бүртгэгдлээ', { variant: 'success' });
        resetForm();
      } catch (error: any) {
        console.error('Error registering patient:', error);
        enqueueSnackbar(
          error.response?.data?.error || 'Хэрэглэгч бүртгэхэд алдаа гарлаа',
          { variant: 'error' }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Шинэ хэрэглэгч бүртгэх</h1>
            <p className="text-gray-600 mt-1">
              Эмнэлгийн үйлчлүүлэгч бүртгэх хэсэг. Бүртгэснээр хэрэглэгч автоматаар үүсэж, нууц үг нь утасны дугаар руу илгээгдэнэ.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Хувийн мэдээлэл</h2>
                
                <div>
                  <label htmlFor="sisiId" className="block text-sm font-medium text-gray-700">
                    Хэрэглэгчийн нэр
                  </label>
                  <input
                    id="sisiId"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.sisiId && formik.errors.sisiId
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('sisiId')}
                  />
                  {formik.touched.sisiId && formik.errors.sisiId && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.sisiId}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Овог
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('lastName')}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Нэр
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('firstName')}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-700">
                    Регистрийн дугаар
                  </label>
                  <input
                    id="registerNumber"
                    type="text"
                    placeholder="ФБ99112233"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.registerNumber && formik.errors.registerNumber
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('registerNumber')}
                  />
                  {formik.touched.registerNumber && formik.errors.registerNumber && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.registerNumber}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Нэмэлт мэдээлэл</h2>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </label>
                  <input
                    id="phoneNumber"
                    type="text"
                    placeholder="99887766"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('phoneNumber')}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                    Сургууль
                  </label>
                  <input
                    id="university"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.university && formik.errors.university
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('university')}
                  />
                  {formik.touched.university && formik.errors.university && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.university}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="courseYear" className="block text-sm font-medium text-gray-700">
                    Курс
                  </label>
                  <input
                    id="courseYear"
                    type="number"
                    min="1"
                    max="7"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.courseYear && formik.errors.courseYear
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    {...formik.getFieldProps('courseYear')}
                  />
                  {formik.touched.courseYear && formik.errors.courseYear && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.courseYear}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Бүртгэж байна...' : 'Бүртгэх'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 