"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface FooterContent {
  id: string;
  section: string;
  title: string;
  description: string;
  links: Array<{ label: string; url: string }>;
  updated_at: string;
}

export default function FooterContent() {
  const [contents, setContents] = useState<FooterContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .order('section');

      if (error) throw error;
      setContents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content: FooterContent) => {
    setSaving(content.id);
    setError(null);

    try {
      const { error } = await supabase
        .from('footer_content')
        .update({
          ...content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', content.id);

      if (error) throw error;
      fetchContents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(null);
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
            <h1 className="mb-30">Footer İçerikleri</h1>

            {error && (
              <div className="alert alert-danger mb-20">{error}</div>
            )}

            {contents.length === 0 ? (
              <div className="alert alert-info">
                Henüz içerik yok. Veritabanında footer_content tablosunu oluşturun.
              </div>
            ) : (
              <div className="d-flex flex-column gap-30">
                {contents.map((content) => (
                  <FooterContentEditor
                    key={content.id}
                    content={content}
                    onSave={handleSave}
                    saving={saving === content.id}
                  />
                ))}
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

function FooterContentEditor({ content, onSave, saving }: { content: FooterContent; onSave: (content: FooterContent) => void; saving: boolean }) {
  const [formData, setFormData] = useState(content);

  return (
    <div className="card-grid-2" style={{ padding: "30px", borderRadius: "16px" }}>
      <h4 className="mb-20">{formData.section}</h4>
      <div className="form-group mb-20">
        <label className="form-label">Başlık</label>
        <input
          type="text"
          className="form-control"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="form-group mb-20">
        <label className="form-label">Açıklama</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="form-group mb-20">
        <label className="form-label">Linkler (JSON formatında)</label>
        <textarea
          className="form-control"
          rows={5}
          value={JSON.stringify(formData.links, null, 2)}
          onChange={(e) => {
            try {
              const links = JSON.parse(e.target.value);
              setFormData({ ...formData, links });
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
        />
      </div>
      <button
        className="btn btn-brand-1 hover-up"
        onClick={() => onSave(formData)}
        disabled={saving}
      >
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}

