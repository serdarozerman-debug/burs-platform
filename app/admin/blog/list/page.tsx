"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function BlogList() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Eğer tablo yoksa veya boşsa, statik blog yazılarını göster
      if (!data || data.length === 0) {
        const staticPosts: BlogPost[] = [
          {
            id: 'static-1',
            title: '11 Tips to Help You Get New Clients',
            content: 'Blog içeriği...',
            slug: '11-tips-to-help-you-get-new-clients',
            author: 'Azumi Rose',
            published_at: '2022-04-25T00:00:00Z',
            created_at: '2022-04-25T00:00:00Z',
            updated_at: '2022-04-25T00:00:00Z',
          },
          {
            id: 'static-2',
            title: 'İşveren Bul ve Hayalinizdeki Bursu Bul',
            content: 'Blog içeriği...',
            slug: 'isveren-bul-ve-hayalinizdeki-bursu-bul',
            author: 'Thompson',
            published_at: '2022-04-28T00:00:00Z',
            created_at: '2022-04-28T00:00:00Z',
            updated_at: '2022-04-28T00:00:00Z',
          },
          {
            id: 'static-3',
            title: 'İyi Ödenen Evden Çalışma Bursları',
            content: 'Blog içeriği...',
            slug: 'iyi-odenen-evden-calisma-burslari',
            author: 'Alice Json',
            published_at: '2022-04-29T00:00:00Z',
            created_at: '2022-04-29T00:00:00Z',
            updated_at: '2022-04-29T00:00:00Z',
          },
          {
            id: 'static-4',
            title: '21 Burs Mülakatı İpuçları: Harika Bir İzlenim Bırakmanın Yolları',
            content: 'Blog içeriği...',
            slug: '21-burs-mulakati-ipuclari',
            author: 'Azumi Rose',
            published_at: '2022-04-25T00:00:00Z',
            created_at: '2022-04-25T00:00:00Z',
            updated_at: '2022-04-25T00:00:00Z',
          },
          {
            id: 'static-5',
            title: 'Email Examples: How To Respond to Employer Interview Requests',
            content: 'Blog içeriği...',
            slug: 'email-examples-how-to-respond',
            author: 'Azumi Rose',
            published_at: '2022-04-25T00:00:00Z',
            created_at: '2022-04-25T00:00:00Z',
            updated_at: '2022-04-25T00:00:00Z',
          },
        ];
        setPosts(staticPosts);
        setError(null);
      } else {
        setPosts(data);
      }
    } catch (err: any) {
      console.error('Blog fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (err: any) {
      alert('Silme işlemi başarısız: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-100 mb-100">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-100 mb-100">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-30">
              <h1>Blog Yazıları</h1>
              <Link href="/admin/blog/new">
                <button className="btn btn-brand-1 hover-up">Yeni Yazı Ekle</button>
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger mb-20">{error}</div>
            )}

            {posts.length === 0 ? (
              <div className="alert alert-info">
                Veritabanında blog yazısı yok. Yeni bir yazı ekleyin veya SQL script'ini çalıştırın.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Yazar</th>
                      <th>Oluşturulma</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{new Date(post.created_at).toLocaleDateString('tr-TR')}</td>
                        <td>
                          {post.published_at ? (
                            <span className="badge bg-success">Yayında</span>
                          ) : (
                            <span className="badge bg-warning">Taslak</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-10">
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <button className="btn btn-sm btn-default">Düzenle</button>
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(post.id)}
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-30">
              <Link href="/admin/dashboard">
                <button className="btn btn-default">Dashboard'a Dön</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

