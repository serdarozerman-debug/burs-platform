import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Tüm istatistikleri paralel olarak çek
    const [
      usersResult,
      scholarshipsResult,
      organizationsResult,
      applicationsResult,
    ] = await Promise.all([
      // Toplam kullanıcı sayısı
      supabase
        .from('user_profiles')
        .select('id, created_at, role', { count: 'exact', head: false }),
      
      // Toplam burs sayısı
      supabase
        .from('scholarships')
        .select('id, created_at, is_active, is_published', { count: 'exact', head: false }),
      
      // Toplam kurum sayısı
      supabase
        .from('organizations')
        .select('id, created_at, is_verified', { count: 'exact', head: false }),
      
      // Toplam başvuru sayısı (eğer applications tablosu varsa)
      supabase
        .from('applications')
        .select('id, created_at, status', { count: 'exact', head: false })
        .then(result => result)
        .catch(() => ({ data: [], count: 0, error: null })),
    ]);

    // Check for errors
    if (usersResult.error) {
      console.error('Users query error:', usersResult.error);
      throw new Error(`Kullanıcı verileri alınamadı: ${usersResult.error.message}`);
    }
    if (scholarshipsResult.error) {
      console.error('Scholarships query error:', scholarshipsResult.error);
      throw new Error(`Burs verileri alınamadı: ${scholarshipsResult.error.message}`);
    }
    if (organizationsResult.error) {
      console.error('Organizations query error:', organizationsResult.error);
      throw new Error(`Kurum verileri alınamadı: ${organizationsResult.error.message}`);
    }

    const users = usersResult.data || [];
    const scholarships = scholarshipsResult.data || [];
    const organizations = organizationsResult.data || [];
    const applications = applicationsResult.data || [];

    // Zaman bazlı veriler (son 30 gün)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Son 30 günlük kullanıcı kayıtları
    const recentUsers = users.filter((u: any) => {
      const createdAt = new Date(u.created_at);
      return createdAt >= thirtyDaysAgo;
    });

    // Son 30 günlük burs eklemeleri
    const recentScholarships = scholarships.filter((s: any) => {
      const createdAt = new Date(s.created_at);
      return createdAt >= thirtyDaysAgo;
    });

    // Son 30 günlük kurum eklemeleri
    const recentOrganizations = organizations.filter((o: any) => {
      const createdAt = new Date(o.created_at);
      return createdAt >= thirtyDaysAgo;
    });

    // Son 30 günlük başvurular
    const recentApplications = applications.filter((a: any) => {
      const createdAt = new Date(a.created_at);
      return createdAt >= thirtyDaysAgo;
    });

    // Günlük istatistikler (son 7 gün)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayUsers = users.filter((u: any) => {
        return u.created_at?.startsWith(dateStr);
      }).length;

      const dayScholarships = scholarships.filter((s: any) => {
        return s.created_at?.startsWith(dateStr);
      }).length;

      const dayOrganizations = organizations.filter((o: any) => {
        return o.created_at?.startsWith(dateStr);
      }).length;

      const dayApplications = applications.filter((a: any) => {
        return a.created_at?.startsWith(dateStr);
      }).length;

      dailyStats.push({
        date: dateStr,
        users: dayUsers,
        scholarships: dayScholarships,
        organizations: dayOrganizations,
        applications: dayApplications,
      });
    }

    // Rol bazlı kullanıcı dağılımı
    const roleDistribution = {
      student: users.filter((u: any) => u.role === 'student').length,
      organization: users.filter((u: any) => u.role === 'organization').length,
      admin: users.filter((u: any) => u.role === 'admin').length,
    };

    // Aktif/pasif burs dağılımı
    const scholarshipStatus = {
      active: scholarships.filter((s: any) => s.is_active && s.is_published).length,
      inactive: scholarships.filter((s: any) => !s.is_active || !s.is_published).length,
    };

    // Doğrulanmış/doğrulanmamış kurum dağılımı
    const organizationStatus = {
      verified: organizations.filter((o: any) => o.is_verified).length,
      unverified: organizations.filter((o: any) => !o.is_verified).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          users: users.length,
          scholarships: scholarships.length,
          organizations: organizations.length,
          applications: applications.length,
        },
        recent: {
          users: recentUsers.length,
          scholarships: recentScholarships.length,
          organizations: recentOrganizations.length,
          applications: recentApplications.length,
        },
        dailyStats,
        distributions: {
          roles: roleDistribution,
          scholarshipStatus,
          organizationStatus,
        },
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu', details: error.message },
      { status: 500 }
    );
  }
}

