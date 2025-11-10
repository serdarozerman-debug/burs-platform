'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrgLayout from '@/components/organization/OrgLayout';
import ScholarshipForm from '@/components/organization/ScholarshipForm';
import { apiClient } from '@/lib/api-client';

export default function NewScholarshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(data: any) {
    try {
      setLoading(true);
      setError('');
      
      await apiClient.post('/api/scholarships', data);
      
      router.push('/organization/scholarships');
    } catch (err: any) {
      setError(err.message || 'Burs oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OrgLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Burs Ekle</h1>
          <p className="text-gray-600 mt-1">
            Burs ilanı bilgilerini doldurun
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <ScholarshipForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Burs Oluştur"
        />
      </div>
    </OrgLayout>
  );
}

