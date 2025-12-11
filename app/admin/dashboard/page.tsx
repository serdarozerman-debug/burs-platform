"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";

interface StatsData {
  totals: {
    users: number;
    scholarships: number;
    organizations: number;
    applications: number;
  };
  recent: {
    users: number;
    scholarships: number;
    organizations: number;
    applications: number;
  };
  dailyStats: Array<{
    date: string;
    users: number;
    scholarships: number;
    organizations: number;
    applications: number;
  }>;
  distributions: {
    roles: {
      student: number;
      organization: number;
      admin: number;
    };
    scholarshipStatus: {
      active: number;
      inactive: number;
    };
    organizationStatus: {
      verified: number;
      unverified: number;
    };
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Oturum kontrolü sırasında bir hata oluştu');
          setLoading(false);
          return;
        }
        
        if (!session) {
          router.push('/login?redirect=/admin/dashboard');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, role, email, full_name')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          setError('Kullanıcı profili bulunamadı');
          setLoading(false);
          return;
        }

        if (!profile || profile.role !== 'admin') {
          setError('Bu sayfaya erişim yetkiniz yok. Sadece admin kullanıcılar erişebilir.');
          setLoading(false);
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }

        setUser(profile);
      } catch (err: any) {
        console.error('Admin check error:', err);
        setError('Yetki kontrolü sırasında bir hata oluştu');
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || result.details || 'İstatistikler alınamadı');
        }
        
        if (!result.success || !result.data) {
          throw new Error('Geçersiz veri formatı');
        }
        
        setStats(result.data);
        setError(null);
      } catch (err: any) {
        console.error('Stats fetch error:', err);
        setError(err.message || 'İstatistikler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-100 mb-100">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-20">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mt-100 mb-100">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return null;
  }

  const yesterdayStats = stats.dailyStats[stats.dailyStats.length - 2] || {
    users: 0,
    scholarships: 0,
    organizations: 0,
    applications: 0,
  };

  return (
    <Layout>
      <div className="container mt-100 mb-100">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-30">Admin Dashboard</h1>
            <p className="font-lg color-text-paragraph-2 mb-40">
              Platform istatistikleri ve zaman bazlı değişimler
            </p>
          </div>
        </div>

        {/* Toplam İstatistikler */}
        <div className="row mb-40">
          <div className="col-lg-3 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-10" style={{ fontSize: "32px", fontWeight: "bold", color: "#4A90E2" }}>
                    {stats.totals.users.toLocaleString('tr-TR')}
                  </h3>
                  <p className="font-lg mb-5" style={{ fontWeight: "600" }}>Toplam Üye</p>
                  <p className="font-sm color-text-paragraph-2">
                    Son 30 gün: <span className="color-brand-1">+{stats.recent.users}</span>
                  </p>
                  <p className="font-xs color-text-paragraph-2">
                    {calculateChange(stats.recent.users, yesterdayStats.users) > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(calculateChange(stats.recent.users, yesterdayStats.users))}% dünkü güne göre
                  </p>
                </div>
                <div style={{ fontSize: "48px", color: "#4A90E2", opacity: 0.2 }}>
                  👥
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-10" style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>
                    {stats.totals.scholarships.toLocaleString('tr-TR')}
                  </h3>
                  <p className="font-lg mb-5" style={{ fontWeight: "600" }}>Toplam Burs</p>
                  <p className="font-sm color-text-paragraph-2">
                    Son 30 gün: <span className="color-brand-1">+{stats.recent.scholarships}</span>
                  </p>
                  <p className="font-xs color-text-paragraph-2">
                    Aktif: {stats.distributions.scholarshipStatus.active} | 
                    Pasif: {stats.distributions.scholarshipStatus.inactive}
                  </p>
                </div>
                <div style={{ fontSize: "48px", color: "#28a745", opacity: 0.2 }}>
                  📚
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-10" style={{ fontSize: "32px", fontWeight: "bold", color: "#ffc107" }}>
                    {stats.totals.organizations.toLocaleString('tr-TR')}
                  </h3>
                  <p className="font-lg mb-5" style={{ fontWeight: "600" }}>Toplam Kurum</p>
                  <p className="font-sm color-text-paragraph-2">
                    Son 30 gün: <span className="color-brand-1">+{stats.recent.organizations}</span>
                  </p>
                  <p className="font-xs color-text-paragraph-2">
                    Doğrulanmış: {stats.distributions.organizationStatus.verified} | 
                    Beklemede: {stats.distributions.organizationStatus.unverified}
                  </p>
                </div>
                <div style={{ fontSize: "48px", color: "#ffc107", opacity: 0.2 }}>
                  🏢
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-10" style={{ fontSize: "32px", fontWeight: "bold", color: "#dc3545" }}>
                    {stats.totals.applications.toLocaleString('tr-TR')}
                  </h3>
                  <p className="font-lg mb-5" style={{ fontWeight: "600" }}>Toplam Başvuru</p>
                  <p className="font-sm color-text-paragraph-2">
                    Son 30 gün: <span className="color-brand-1">+{stats.recent.applications}</span>
                  </p>
                </div>
                <div style={{ fontSize: "48px", color: "#dc3545", opacity: 0.2 }}>
                  📝
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Günlük İstatistikler Grafiği */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <h3 className="mb-30" style={{ fontWeight: "700" }}>Son 7 Günlük Aktivite</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Yeni Üye</th>
                      <th>Yeni Burs</th>
                      <th>Yeni Kurum</th>
                      <th>Yeni Başvuru</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailyStats.map((day, index) => {
                      const prevDay = stats.dailyStats[index - 1] || { users: 0, scholarships: 0, organizations: 0, applications: 0 };
                      return (
                        <tr key={day.date}>
                          <td style={{ fontWeight: "600" }}>{formatDate(day.date)}</td>
                          <td>
                            {day.users}
                            {day.users > prevDay.users && (
                              <span className="color-brand-1 ml-5">↑</span>
                            )}
                            {day.users < prevDay.users && (
                              <span className="color-text-paragraph-2 ml-5">↓</span>
                            )}
                          </td>
                          <td>
                            {day.scholarships}
                            {day.scholarships > prevDay.scholarships && (
                              <span className="color-brand-1 ml-5">↑</span>
                            )}
                            {day.scholarships < prevDay.scholarships && (
                              <span className="color-text-paragraph-2 ml-5">↓</span>
                            )}
                          </td>
                          <td>
                            {day.organizations}
                            {day.organizations > prevDay.organizations && (
                              <span className="color-brand-1 ml-5">↑</span>
                            )}
                            {day.organizations < prevDay.organizations && (
                              <span className="color-text-paragraph-2 ml-5">↓</span>
                            )}
                          </td>
                          <td>
                            {day.applications}
                            {day.applications > prevDay.applications && (
                              <span className="color-brand-1 ml-5">↑</span>
                            )}
                            {day.applications < prevDay.applications && (
                              <span className="color-text-paragraph-2 ml-5">↓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Dağılım İstatistikleri */}
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <h4 className="mb-20" style={{ fontWeight: "700" }}>Kullanıcı Rolleri</h4>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Öğrenci</span>
                  <span className="font-bold">{stats.distributions.roles.student}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.roles.student / stats.totals.users) * 100}%`,
                      backgroundColor: "#4A90E2",
                    }}
                  />
                </div>
              </div>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Kurum</span>
                  <span className="font-bold">{stats.distributions.roles.organization}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.roles.organization / stats.totals.users) * 100}%`,
                      backgroundColor: "#28a745",
                    }}
                  />
                </div>
              </div>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Admin</span>
                  <span className="font-bold">{stats.distributions.roles.admin}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.roles.admin / stats.totals.users) * 100}%`,
                      backgroundColor: "#ffc107",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <h4 className="mb-20" style={{ fontWeight: "700" }}>Burs Durumu</h4>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Aktif</span>
                  <span className="font-bold color-brand-1">{stats.distributions.scholarshipStatus.active}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.scholarshipStatus.active / stats.totals.scholarships) * 100}%`,
                      backgroundColor: "#28a745",
                    }}
                  />
                </div>
              </div>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Pasif</span>
                  <span className="font-bold">{stats.distributions.scholarshipStatus.inactive}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.scholarshipStatus.inactive / stats.totals.scholarships) * 100}%`,
                      backgroundColor: "#dc3545",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-20">
            <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
              <h4 className="mb-20" style={{ fontWeight: "700" }}>Kurum Durumu</h4>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Doğrulanmış</span>
                  <span className="font-bold color-brand-1">{stats.distributions.organizationStatus.verified}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.organizationStatus.verified / stats.totals.organizations) * 100}%`,
                      backgroundColor: "#28a745",
                    }}
                  />
                </div>
              </div>
              <div className="mb-10">
                <div className="d-flex justify-content-between mb-5">
                  <span>Beklemede</span>
                  <span className="font-bold">{stats.distributions.organizationStatus.unverified}</span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(stats.distributions.organizationStatus.unverified / stats.totals.organizations) * 100}%`,
                      backgroundColor: "#ffc107",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yönetim Paneli */}
        <ManagementPanel />
      </div>
    </Layout>
  );
}

// Yönetim Paneli Component
function ManagementPanel() {
  const [homepageContents, setHomepageContents] = useState<any[]>([]);
  const [footerContents, setFooterContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      // Önce tabloları kontrol et ve varsayılan verileri oluştur
      const [homepageResult, footerResult] = await Promise.all([
        supabase.from('homepage_content').select('*').order('key'),
        supabase.from('footer_content').select('*').order('section'),
      ]);

      // Eğer homepage_content boşsa varsayılan verileri oluştur
      if (homepageResult.data && homepageResult.data.length === 0) {
        const defaultHomepage = [
          { key: 'hero_title', title: 'Ana Başlık', content: 'BursBuldum' },
          { key: 'hero_subtitle', title: 'Alt Başlık', content: 'Yurtiçi ve yurtdışındaki üniversite burslarına kolayca ulaşın' },
          { key: 'hero_description', title: 'Açıklama', content: 'BursBuldum platformu ile binlerce burs fırsatını keşfedin' },
        ];
        
        for (const item of defaultHomepage) {
          try {
            await supabase.from('homepage_content').insert([item]);
          } catch (insertErr) {
            console.error('Insert error:', insertErr);
          }
        }
        // Tekrar çek
        const { data: newData } = await supabase.from('homepage_content').select('*').order('key');
        if (newData) setHomepageContents(newData);
      } else if (homepageResult.data) {
        setHomepageContents(homepageResult.data);
      }

      // Eğer footer_content boşsa varsayılan verileri oluştur
      if (footerResult.data && footerResult.data.length === 0) {
        const defaultFooter = [
          { section: 'home', title: 'Ana Sayfa', description: '', links: [] },
          { section: 'about', title: 'Hakkımızda', description: '', links: [] },
          { section: 'blog', title: 'Blog', description: '', links: [] },
          { section: 'contact', title: 'İletişim', description: '', links: [] },
        ];
        
        for (const item of defaultFooter) {
          try {
            await supabase.from('footer_content').insert([item]);
          } catch (insertErr) {
            console.error('Insert error:', insertErr);
          }
        }
        // Tekrar çek
        const { data: newData } = await supabase.from('footer_content').select('*').order('section');
        if (newData) setFooterContents(newData);
      } else if (footerResult.data) {
        setFooterContents(footerResult.data);
      }
    } catch (err: any) {
      console.error('Content fetch error:', err);
      // Hata durumunda varsayılan verileri göster
      if (err.message?.includes('does not exist') || err.message?.includes('PGRST')) {
        setHomepageContents([
          { id: '1', key: 'hero_title', title: 'Ana Başlık', content: 'BursBuldum', created_at: '', updated_at: '' },
          { id: '2', key: 'hero_subtitle', title: 'Alt Başlık', content: 'Yurtiçi ve yurtdışındaki üniversite burslarına kolayca ulaşın', created_at: '', updated_at: '' },
          { id: '3', key: 'hero_description', title: 'Açıklama', content: 'BursBuldum platformu ile binlerce burs fırsatını keşfedin', created_at: '', updated_at: '' },
        ]);
        setFooterContents([
          { id: '1', section: 'home', title: 'Ana Sayfa', description: '', links: [], created_at: '', updated_at: '' },
          { id: '2', section: 'about', title: 'Hakkımızda', description: '', links: [], created_at: '', updated_at: '' },
          { id: '3', section: 'blog', title: 'Blog', description: '', links: [], created_at: '', updated_at: '' },
          { id: '4', section: 'contact', title: 'İletişim', description: '', links: [], created_at: '', updated_at: '' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHomepageSave = async (id: string, title: string, content: string) => {
    setSaving(`homepage-${id}`);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      fetchContents();
    } catch (err: any) {
      alert('Kaydetme hatası: ' + err.message);
    } finally {
      setSaving(null);
    }
  };

  const handleFooterSave = async (id: string, title: string, description: string) => {
    setSaving(`footer-${id}`);
    try {
      const { error } = await supabase
        .from('footer_content')
        .update({ title, description, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      fetchContents();
    } catch (err: any) {
      alert('Kaydetme hatası: ' + err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <>
      <div className="row mt-80">
        <div className="col-12">
          <h2 className="mb-30">Yönetim Paneli</h2>
        </div>
      </div>

      <div className="row">
        {/* Blog Yönetimi */}
        <div className="col-lg-6 mb-30">
          <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
            <h3 className="mb-20">Blog Yönetimi</h3>
            <p className="font-sm color-text-paragraph-2 mb-20">
              Blog yazılarını oluşturun, düzenleyin ve silin.
            </p>
            <div className="d-flex flex-column gap-10">
              <button className="btn btn-brand-1 hover-up" onClick={() => window.location.href = '/admin/blog/new'}>
                Yeni Blog Yazısı Ekle
              </button>
              <button className="btn btn-default hover-up" onClick={() => window.location.href = '/admin/blog/list'}>
                Blog Yazılarını Listele
              </button>
            </div>
          </div>
        </div>

        {/* Ana Sayfa Metinleri Yönetimi */}
        <div className="col-lg-12 mb-30">
          <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
            <h3 className="mb-20">Ana Sayfa Metinleri</h3>
            <p className="font-sm color-text-paragraph-2 mb-30">
              Ana sayfadaki başlık ve metinleri güncelleyin.
            </p>
            
            {loading ? (
              <div className="text-center">Yükleniyor...</div>
            ) : homepageContents.length > 0 ? (
              <div className="row">
                {homepageContents.map((item) => (
                  <div key={item.id} className="col-lg-12 mb-20">
                    <HomepageContentEditor
                      item={item}
                      onSave={handleHomepageSave}
                      saving={saving === `homepage-${item.id}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info font-xs">
                İçerik bulunamadı. Veritabanı tablosunu oluşturun.
              </div>
            )}
            
            <div className="mt-20">
              <button className="btn btn-default hover-up w-100" onClick={() => window.location.href = '/admin/homepage/content'}>
                Tüm İçerikleri Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* Footer Yönetimi */}
        <div className="col-lg-12 mb-30">
          <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
            <h3 className="mb-20">Footer Yönetimi</h3>
            <p className="font-sm color-text-paragraph-2 mb-30">
              Footer bölümündeki içerikleri yönetin.
            </p>
            
            {loading ? (
              <div className="text-center">Yükleniyor...</div>
            ) : footerContents.length > 0 ? (
              <div className="row">
                {footerContents.map((item) => (
                  <div key={item.id} className="col-lg-12 mb-20">
                    <FooterContentEditor
                      item={item}
                      onSave={handleFooterSave}
                      saving={saving === `footer-${item.id}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info font-xs">
                İçerik bulunamadı. Veritabanı tablosunu oluşturun.
              </div>
            )}
            
            <div className="mt-20">
              <button className="btn btn-default hover-up w-100" onClick={() => window.location.href = '/admin/footer/content'}>
                Tüm İçerikleri Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomepageContentEditor({ item, onSave, saving }: { item: any; onSave: (id: string, title: string, content: string) => void; saving: boolean }) {
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');

  return (
    <div style={{ 
      border: "1px solid #e0e0e0", 
      borderRadius: "8px", 
      padding: "20px", 
      backgroundColor: "#ffffff",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <div className="font-sm font-weight-bold mb-20" style={{ color: "#4A90E2", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {item.key}
      </div>
      <div className="form-group mb-20">
        <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#333" }}>
          Başlık
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Başlık girin"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ fontSize: "14px", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "6px", width: "100%" }}
        />
      </div>
      <div className="form-group mb-20">
        <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#333" }}>
          İçerik
        </label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="İçerik girin"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ fontSize: "14px", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "6px", width: "100%", resize: "vertical", minHeight: "100px" }}
        />
      </div>
      <button
        className="btn btn-sm btn-brand-1"
        onClick={() => onSave(item.id, title, content)}
        disabled={saving}
        style={{ width: "100%", padding: "10px", fontSize: "14px", fontWeight: "600" }}
      >
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}

function FooterContentEditor({ item, onSave, saving }: { item: any; onSave: (id: string, title: string, description: string) => void; saving: boolean }) {
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');

  return (
    <div style={{ 
      border: "1px solid #e0e0e0", 
      borderRadius: "8px", 
      padding: "20px", 
      backgroundColor: "#ffffff",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <div className="font-sm font-weight-bold mb-20" style={{ color: "#4A90E2", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {item.section}
      </div>
      <div className="form-group mb-20">
        <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#333" }}>
          Başlık
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Başlık girin"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ fontSize: "14px", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "6px", width: "100%" }}
        />
      </div>
      <div className="form-group mb-20">
        <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#333" }}>
          Açıklama
        </label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="Açıklama girin"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ fontSize: "14px", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "6px", width: "100%", resize: "vertical", minHeight: "100px" }}
        />
      </div>
      <button
        className="btn btn-sm btn-brand-1"
        onClick={() => onSave(item.id, title, description)}
        disabled={saving}
        style={{ width: "100%", padding: "10px", fontSize: "14px", fontWeight: "600" }}
      >
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}

