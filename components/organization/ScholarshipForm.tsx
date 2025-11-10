'use client';

import { useState } from 'react';
import { validators } from '@/utils/validators';

interface ScholarshipFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  submitLabel: string;
}

export default function ScholarshipForm({
  initialData,
  onSubmit,
  loading,
  submitLabel
}: ScholarshipFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    amount_type: initialData?.amount_type || 'aylık',
    type: initialData?.type || 'akademik',
    education_level: initialData?.education_level || 'lisans',
    field: initialData?.field || '',
    deadline: initialData?.deadline || '',
    min_gpa: initialData?.min_gpa || '',
    min_age: initialData?.min_age || '',
    max_age: initialData?.max_age || '',
    total_quota: initialData?.total_quota || '',
    eligibility_criteria: initialData?.eligibility_criteria || '',
    application_method: initialData?.application_method || 'online',
    contact_email: initialData?.contact_email || '',
    contact_phone: initialData?.contact_phone || '',
    is_published: initialData?.is_published ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.title)) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!validators.required(formData.description)) {
      newErrors.description = 'Açıklama gereklidir';
    }

    if (!validators.required(formData.amount)) {
      newErrors.amount = 'Miktar gereklidir';
    }

    if (!validators.required(formData.deadline)) {
      newErrors.deadline = 'Son başvuru tarihi gereklidir';
    }

    if (formData.contact_email && !validators.email(formData.contact_email)) {
      newErrors.contact_email = 'Geçerli bir email girin';
    }

    if (formData.contact_phone && !validators.phone(formData.contact_phone)) {
      newErrors.contact_phone = 'Geçerli bir telefon numarası girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Basic Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Burs Başlığı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Örn: TÜBİTAK 2210-A Genel Yüksek Lisans Bursu"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Burs hakkında detaylı bilgi..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burs Miktarı (TL) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="15000"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ödeme Tipi *
              </label>
              <select
                name="amount_type"
                value={formData.amount_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="aylık">Aylık</option>
                <option value="yıllık">Yıllık</option>
                <option value="tek seferlik">Tek Seferlik</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Burs Türü *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="akademik">Akademik</option>
              <option value="ihtiyaç">İhtiyaç</option>
              <option value="engelli">Engelli</option>
              <option value="sporcu">Sporcu</option>
              <option value="sanatçı">Sanatçı</option>
              <option value="girişimci">Girişimci</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eğitim Seviyesi *
            </label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="lise">Lise</option>
              <option value="önlisans">Önlisans</option>
              <option value="lisans">Lisans</option>
              <option value="yükseklisans">Yükseklisans</option>
              <option value="doktora">Doktora</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alan (Opsiyonel)
            </label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: Mühendislik, Tıp, Hukuk"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Son Başvuru Tarihi *
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.deadline ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gereklilikler</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum GPA
            </label>
            <input
              type="number"
              step="0.01"
              name="min_gpa"
              value={formData.min_gpa}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="2.50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Yaş
            </label>
            <input
              type="number"
              name="min_age"
              value={formData.min_age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="18"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Yaş
            </label>
            <input
              type="number"
              name="max_age"
              value={formData.max_age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="35"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uygunluk Kriterleri
          </label>
          <textarea
            name="eligibility_criteria"
            value={formData.eligibility_criteria}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Başvuru için gerekli kriterler..."
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontenjan
          </label>
          <input
            type="number"
            name="total_quota"
            value={formData.total_quota}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İletişim Email
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.contact_email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="burs@kurum.com"
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İletişim Telefon
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.contact_phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="05XX XXX XX XX"
            />
            {errors.contact_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Publish */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_published"
          checked={formData.is_published}
          onChange={handleChange}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Yayınla (İlanı hemen aktif et)
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Kaydediliyor...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

