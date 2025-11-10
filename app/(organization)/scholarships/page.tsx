'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import OrgLayout from '@/components/organization/OrgLayout';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2, Calendar, Coins } from 'lucide-react';
import { formatters } from '@/utils/formatters';

export default function ScholarshipsPage() {
  const { getScholarships } = useOrganization();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
  }, []);

  async function loadScholarships() {
    try {
      const data = await getScholarships();
      setScholarships(data || []);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu bursu silmek istediğinizden emin misiniz?')) return;

    try {
      // TODO: Implement delete API
      setScholarships(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      alert('Silme işlemi başarısız oldu');
    }
  }

  if (loading) {
    return (
      <OrgLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </OrgLayout>
    );
  }

  return (
    <OrgLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Burslarım</h1>
            <p className="text-gray-600 mt-1">
              Toplam {scholarships.length} burs ilanı
            </p>
          </div>
          <Link
            href="/organization/scholarships/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Yeni Burs Ekle
          </Link>
        </div>

        {/* Scholarships List */}
        {scholarships.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz burs ilanınız yok
            </h3>
            <p className="text-gray-600 mb-6">
              İlk burs ilanınızı oluşturarak başlayın
            </p>
            <Link
              href="/organization/scholarships/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Burs Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title & Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {scholarship.title}
                      </h3>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${scholarship.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {scholarship.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {scholarship.description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatters.currency(scholarship.amount)}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {scholarship.amount_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">
                          Son: {formatters.date(scholarship.deadline)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {scholarship.view_count || 0} görüntüleme
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {scholarship.application_count || 0} başvuru
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                        {scholarship.type}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                        {scholarship.education_level}
                      </span>
                      {scholarship.field && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {scholarship.field}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    <Link
                      href={`/organization/scholarships/${scholarship.id}`}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Görüntüle
                    </Link>
                    <Link
                      href={`/organization/scholarships/${scholarship.id}/edit`}
                      className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(scholarship.id)}
                      className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OrgLayout>
  );
}

