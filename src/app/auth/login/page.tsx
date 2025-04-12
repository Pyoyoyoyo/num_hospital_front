'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object({
  sisiId: yup
    .string()
    .required('Хэрэглэгчийн нэр оруулна уу'),
  password: yup
    .string()
    .min(6, 'Нууц үг 6-с дээш тэмдэгт байх ёстой')
    .required('Нууц үг оруулна уу'),
});

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/auth/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const formik = useFormik({
    initialValues: {
      sisiId: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await login({
          sisiId: values.sisiId,
          password: values.password,
        });
        // Successful login is handled by useEffect
      } catch (error: any) {
        console.error('Login error:', error);
        setFieldError('sisiId', 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Ачааллаж байна...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex justify-center items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900">
              Нэвтрэх
            </h1>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="sisiId" className="sr-only">Хэрэглэгчийн нэр</label>
              <input
                id="sisiId"
                type="text"
                autoComplete="sisiId"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formik.touched.sisiId && formik.errors.sisiId ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Хэрэглэгчийн нэр"
                {...formik.getFieldProps('sisiId')}
                autoFocus
              />
              {formik.touched.sisiId && formik.errors.sisiId && (
                <p className="mt-2 text-sm text-red-600" id="sisiId-error">
                  {formik.errors.sisiId}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Нууц үг</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10`}
                  placeholder="Нууц үг"
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                  aria-label="Нууц үг харах/нуух"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
              </button>
            </div>

            <div className="text-sm text-center">
              <p className="text-gray-600">
                Бүртгэлгүй байна уу?{' '}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Бүртгүүлэх
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 