'use client';

import { useAuth } from '@/hooks/useAuth';
import { useStudent } from '@/hooks/useStudent';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Heart, 
  MessageCircle,
  LogOut,
  GraduationCap,
  Folder
} from 'lucide-react';
import { ReactNode } from 'react';

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { user, logout, loading: authLoading } = useAuth();
  const { student, loading: studentLoading } = useStudent();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/student/dashboard',
    },
    {
      icon: User,
      label: 'Profilim',
      href: '/student/profile',
    },
    {
      icon: Folder,
      label: 'Evrak Cüzdanım',
      href: '/student/wallet',
    },
    {
      icon: Briefcase,
      label: 'Başvurularım',
      href: '/student/applications',
    },
    {
      icon: Heart,
      label: 'Favorilerim',
      href: '/student/favorites',
    },
    {
      icon: MessageCircle,
      label: 'AI Asistan',
      href: '/student/chatbot',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || studentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const profileCompletion = student?.profile_completion_percentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">BursBox</h1>
            <p className="text-xs text-gray-500">Öğrenci Paneli</p>
          </div>
        </div>

        {/* Student Info */}
        {student && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {student.current_education_level || 'Öğrenci'}
                </p>
              </div>
            </div>
            
            {/* Profile Completion */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Profil Tamamlama</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Hoş Geldin, {student?.first_name}!
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ana Sayfaya Git →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

