'use client';

import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Building2
} from 'lucide-react';
import { ReactNode } from 'react';

interface OrgLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: OrgLayoutProps) {
  const { user, logout, loading: authLoading } = useAuth();
  const { organization, loading: orgLoading } = useOrganization();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/organization/dashboard',
    },
    {
      icon: FileText,
      label: 'Burslarım',
      href: '/organization/scholarships',
    },
    {
      icon: Users,
      label: 'Başvurular',
      href: '/organization/applications',
    },
    {
      icon: BarChart3,
      label: 'Analitik',
      href: '/organization/analytics',
    },
    {
      icon: Settings,
      label: 'Profil',
      href: '/organization/profile',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Building2 className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">BursBox</h1>
            <p className="text-xs text-gray-500">Kurum Paneli</p>
          </div>
        </div>

        {/* Organization Info */}
        {organization && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {organization.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {organization.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {organization.type}
                </p>
              </div>
            </div>
            {!organization.is_verified && (
              <div className="mt-2 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                ⏳ Onay Bekliyor
              </div>
            )}
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
              Hoş Geldiniz, {organization?.name}
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
              target="_blank"
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

