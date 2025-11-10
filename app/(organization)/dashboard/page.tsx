'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import OrgLayout from '@/components/organization/OrgLayout';
import { 
  FileText, 
  Users, 
  Eye, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function OrganizationDashboard() {
  const { organization, getScholarships, getApplications } = useOrganization();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [schData, appData] = await Promise.all([
          getScholarships(),
          getApplications()
        ]);
        setScholarships(schData || []);
        setApplications(appData || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (organization) {
      loadData();
    }
  }, [organization]);

  const stats = [
    {
      icon: FileText,
      label: 'Toplam Burs',
      value: scholarships.length,
      change: '+2 bu ay',
      color: 'blue',
    },
    {
      icon: Users,
      label: 'Toplam Başvuru',
      value: applications.length,
      change: '+12 bu hafta',
      color: 'green',
    },
    {
      icon: Eye,
      label: 'Toplam Görüntüleme',
      value: scholarships.reduce((acc, s) => acc + (s.view_count || 0), 0),
      change: '+245 bu ay',
      color: 'purple',
    },
    {
      icon: Clock,
      label: 'Bekleyen İnceleme',
      value: applications.filter(a => a.status === 'submitted').length,
      change: 'Dikkat gerekli',
      color: 'orange',
    },
  ];

  const recentApplications = applications.slice(0, 5);

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
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Burs ilanlarınızı ve başvuruları buradan yönetin.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/organization/scholarships/new"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <FileText className="w-6 h-6 mb-2" />
              <p className="font-medium">Yeni Burs Ekle</p>
              <p className="text-sm text-blue-100">İlan oluştur</p>
            </Link>
            <Link
              href="/organization/applications"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <Users className="w-6 h-6 mb-2" />
              <p className="font-medium">Başvuruları Gör</p>
              <p className="text-sm text-blue-100">İncele ve yanıtla</p>
            </Link>
            <Link
              href="/organization/profile"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <p className="font-medium">Profili Güncelle</p>
              <p className="text-sm text-blue-100">Bilgileri düzenle</p>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Son Başvurular
              </h2>
              <Link
                href="/organization/applications"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Henüz başvuru yok
              </div>
            ) : (
              recentApplications.map((app: any) => (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {app.scholarship?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {app.student?.first_name} {app.student?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(app.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${app.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${app.status === 'under_review' ? 'bg-blue-100 text-blue-800' : ''}
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {app.status === 'submitted' && 'Gönderildi'}
                        {app.status === 'under_review' && 'İnceleniyor'}
                        {app.status === 'approved' && 'Onaylandı'}
                        {app.status === 'rejected' && 'Reddedildi'}
                      </span>
                      <Link
                        href={`/organization/applications/${app.id}`}
                        className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        İncele
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}

