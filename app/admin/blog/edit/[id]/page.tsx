"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
    author: "",
    published: false,
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          slug: data.slug || "",
          author: data.author || "",
          published: !!data.published_at,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updateData: any = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        author: formData.author,
        updated_at: new Date().toISOString(),
      };

      if (formData.published && !formData.published) {
        updateData.published_at = new Date().toISOString();
      } else if (!formData.published) {
        updateData.published_at = null;
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/blog/list');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
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
          <div className="col-lg-8 mx-auto">
            <h1 className="mb-30">Blog Yazısını Düzenle</h1>

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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              </div>

              <div className="form-group mb-20">
                <label className="form-label">Yazar</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
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
                  <span>Yayında</span>
                  <span className="checkmark" />
                </label>
              </div>

              <div className="d-flex gap-10">
                <button type="submit" className="btn btn-brand-1 hover-up" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : 'Güncelle'}
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

