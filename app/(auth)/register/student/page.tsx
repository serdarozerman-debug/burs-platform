'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerStudent } from '@/lib/auth';
import { validators } from '@/utils/validators';

export default function StudentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    tc_no: '',
    date_of_birth: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.first_name)) {
      newErrors.first_name = 'Ad gereklidir';
    }

    if (!validators.required(formData.last_name)) {
      newErrors.last_name = 'Soyad gereklidir';
    }

    if (!validators.required(formData.email)) {
      newErrors.email = 'Email gereklidir';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Geçerli bir email girin';
    }

    if (!validators.required(formData.password)) {
      newErrors.password = 'Şifre gereklidir';
    } else {
      const passwordCheck = validators.password(formData.password);
      if (!passwordCheck.valid) {
        newErrors.password = passwordCheck.message || '';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (formData.tc_no && !validators.tcNo(formData.tc_no)) {
      newErrors.tc_no = 'Geçerli bir TC Kimlik No girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await registerStudent({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        tc_no: formData.tc_no || undefined,
        date_of_birth: formData.date_of_birth || undefined,
      });

      router.push('/login?message=Kayıt başarılı. Email adresinizi doğrulayın.');
    } catch (error: any) {
      setGeneralError(error.message || 'Kayıt başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Öğrenci Kaydı
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Giriş yap
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {generalError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{generalError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Ad *
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.first_name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Soyad *
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.last_name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="tc_no" className="block text-sm font-medium text-gray-700">
              TC Kimlik No
            </label>
            <input
              id="tc_no"
              name="tc_no"
              type="text"
              maxLength={11}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.tc_no ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={formData.tc_no}
              onChange={handleChange}
            />
            {errors.tc_no && (
              <p className="mt-1 text-sm text-red-600">{errors.tc_no}</p>
            )}
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Doğum Tarihi
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              En az 8 karakter, büyük/küçük harf ve rakam içermelidir
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Şifre Tekrar *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

