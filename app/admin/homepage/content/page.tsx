"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface HomepageContent {
  id: string;
  key: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function HomepageContent() {
  const [contents, setContents] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('key');

      if (error) throw error;
      setContents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content: HomepageContent, newTitle: string, newContent: string) => {
    setSaving(content.id);
    setError(null);

    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          title: newTitle,
          content: newContent,
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
            <h1 className="mb-30">Ana Sayfa İçerikleri</h1>

            {error && (
              <div className="alert alert-danger mb-20">{error}</div>
            )}

            {contents.length === 0 ? (
              <div className="alert alert-info">
                Henüz içerik yok. Veritabanında homepage_content tablosunu oluşturun.
              </div>
            ) : (
              <div className="d-flex flex-column gap-30">
                {contents.map((content) => (
                  <ContentEditor
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

function ContentEditor({ content, onSave, saving }: { content: HomepageContent; onSave: (content: HomepageContent, title: string, text: string) => void; saving: boolean }) {
  const [title, setTitle] = useState(content.title);
  const [text, setText] = useState(content.content);

  return (
    <div className="card-grid-2" style={{ padding: "30px", borderRadius: "16px" }}>
      <h4 className="mb-20">{content.key}</h4>
      <div className="form-group mb-20">
        <label className="form-label">Başlık</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group mb-20">
        <label className="form-label">İçerik</label>
        <textarea
          className="form-control"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button
        className="btn btn-brand-1 hover-up"
        onClick={() => onSave(content, title, text)}
        disabled={saving}
      >
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}

