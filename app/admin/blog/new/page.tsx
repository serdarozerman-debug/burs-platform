"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    author: "",
    published: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Oturum bulunamadı');
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();

      const postData = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug || generateSlug(formData.title),
        author: formData.author || profile?.full_name || profile?.email || 'Admin',
        published_at: formData.published ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('blog_posts')
        .insert([postData]);

      if (error) throw error;

      router.push('/admin/blog/list');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-100 mb-100">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="mb-30">Yeni Blog Yazısı</h1>

            {error && (
              <div className="alert alert-danger mb-20">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-20">
                <label className="form-label">Başlık *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div className="form-group mb-20">
                <label className="form-label">Slug (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <small className="form-text text-muted">Boş bırakılırsa başlıktan otomatik oluşturulur</small>
              </div>

              <div className="form-group mb-20">
                <label className="form-label">Yazar</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
                <small className="form-text text-muted">Boş bırakılırsa oturum açmış kullanıcı kullanılır</small>
              </div>

              <div className="form-group mb-20">
                <label className="form-label">İçerik *</label>
                <textarea
                  className="form-control"
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-20">
                <label className="cb-container">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span>Hemen yayınla</span>
                  <span className="checkmark" />
                </label>
              </div>

              <div className="d-flex gap-10">
                <button type="submit" className="btn btn-brand-1 hover-up" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <Link href="/admin/blog/list">
                  <button type="button" className="btn btn-default">İptal</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

