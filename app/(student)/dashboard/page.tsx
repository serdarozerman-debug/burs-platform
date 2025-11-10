'use client';

import { useEffect, useState } from 'react';
import { useStudent } from '@/hooks/useStudent';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  Briefcase, 
  Heart, 
  Folder,
  TrendingUp,
  Calendar,
  Award,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { student, calculateProfileCompletion } = useStudent();
  const [stats, setStats] = useState({
    applications: 0,
    favorites: 0,
    documents: 0,
    profileCompletion: 0
  });

  useEffect(() => {
    async function loadStats() {
      const completion = await calculateProfileCompletion();
      setStats(prev => ({ ...prev, profileCompletion: completion }));
    }
    
    if (student) {
      loadStats();
    }
  }, [student]);

  const statCards = [
    {
      icon: Briefcase,
      label: 'Başvurularım',
      value: stats.applications,
      change: '+2 bu ay',
      color: 'blue',
      href: '/student/applications'
    },
    {
      icon: Heart,
      label: 'Favorilerim',
      value: stats.favorites,
      change: '+5 bu hafta',
      color: 'red',
      href: '/student/favorites'
    },
    {
      icon: Folder,
      label: 'Evraklarım',
      value: stats.documents,
      change: `${stats.documents}/15`,
      color: 'green',
      href: '/student/wallet'
    },
    {
      icon: Award,
      label: 'Profil Tamamlama',
      value: `${stats.profileCompletion}%`,
      change: 'Profilini tamamla',
      color: 'purple',
      href: '/student/profile'
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Burs başvurularınızı ve durumunuzu buradan takip edin.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105"
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
            </Link>
          ))}
        </div>

        {/* Profile Completion Alert */}
        {stats.profileCompletion < 100 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Profilini Tamamla!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Profil tamamlama oranın %{stats.profileCompletion}. Daha fazla burs için profilini tamamla ve uygun bursları keşfet.
                </p>
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Profili Tamamla →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <Briefcase className="w-6 h-6 mb-2" />
              <p className="font-medium">Burs Ara</p>
              <p className="text-sm text-blue-100">Yeni bursları keşfet</p>
            </Link>
            <Link
              href="/student/wallet"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <Folder className="w-6 h-6 mb-2" />
              <p className="font-medium">Evrak Yükle</p>
              <p className="text-sm text-blue-100">Belgelerini ekle</p>
            </Link>
            <Link
              href="/student/chatbot"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <p className="font-medium">AI Asistan</p>
              <p className="text-sm text-blue-100">Soru sor, öneri al</p>
            </Link>
          </div>
        </div>

        {/* Recommended Scholarships */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Senin İçin Önerilen Burslar
              </h2>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>
          <div className="p-6 text-center text-gray-500">
            Profilini tamamla, sana özel bursları görelim!
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

