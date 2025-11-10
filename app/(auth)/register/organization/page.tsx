'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerOrganization } from '@/lib/auth';
import { validators } from '@/utils/validators';
import { OrganizationType } from '@/types/auth';

const organizationTypes: { value: OrganizationType; label: string }[] = [
  { value: 'vakıf', label: 'Vakıf' },
  { value: 'kamu', label: 'Kamu Kurumu' },
  { value: 'belediye', label: 'Belediye' },
  { value: 'üniversite', label: 'Üniversite' },
  { value: 'dernek', label: 'Dernek' },
  { value: 'uluslararası', label: 'Uluslararası Kuruluş' },
  { value: 'özel', label: 'Özel Kurum' },
];

export default function OrganizationRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organization_name: '',
    organization_type: 'vakıf' as OrganizationType,
    website: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.organization_name)) {
      newErrors.organization_name = 'Kurum adı gereklidir';
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

    if (formData.website && !validators.url(formData.website)) {
      newErrors.website = 'Geçerli bir website adresi girin';
    }

    if (formData.phone && !validators.phone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
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
      await registerOrganization({
        email: formData.email,
        password: formData.password,
        organization_name: formData.organization_name,
        organization_type: formData.organization_type,
        website: formData.website || undefined,
        phone: formData.phone || undefined,
      });

      router.push('/login?message=Kayıt başarılı. Onay için bekleyiniz.');
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
            Kurum Kaydı
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

          <div>
            <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700">
              Kurum Adı *
            </label>
            <input
              id="organization_name"
              name="organization_name"
              type="text"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.organization_name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={formData.organization_name}
              onChange={handleChange}
            />
            {errors.organization_name && (
              <p className="mt-1 text-sm text-red-600">{errors.organization_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="organization_type" className="block text-sm font-medium text-gray-700">
              Kurum Tipi *
            </label>
            <select
              id="organization_type"
              name="organization_type"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.organization_type}
              onChange={handleChange}
            >
              {organizationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.website ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="https://www.example.com"
              value={formData.website}
              onChange={handleChange}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="05XX XXX XX XX"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
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

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">
              <strong>Not:</strong> Kurum hesabınız admin onayı sonrası aktif olacaktır.
            </p>
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

