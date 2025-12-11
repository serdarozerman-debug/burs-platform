"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import { supabase } from "@/lib/supabase";
import type { WalletDocument } from "@/types/wallet";
import DocumentUpload from "@/components/student/DocumentUpload";

export default function WalletPage() {
  const { user } = useAuth();
  const { student } = useStudent();
  const [documents, setDocuments] = useState<WalletDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (student?.id) {
      fetchDocuments();
    }
  }, [student?.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wallet_documents")
        .select("*")
        .eq("student_id", student!.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!confirm("Bu belgeyi silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("wallet_documents")
        .update({ is_deleted: true })
        .eq("id", docId);

      if (error) throw error;

      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      alert("Belge silindi");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Belge silinirken hata oluştu");
    }
  };

  const downloadDocument = async (doc: WalletDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("student-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.document_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Belge indirilirken hata oluştu");
    }
  };

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  const categories = [
    "all",
    ...Array.from(new Set(documents.map((doc) => doc.category))),
  ];

  const totalSize = documents.reduce((acc, doc) => acc + doc.file_size, 0);
  const maxSize = 100 * 1024 * 1024; // 100 MB
  const usagePercent = (totalSize / maxSize) * 100;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      identity: "🪪",
      transcript: "📊",
      income: "💰",
      student_certificate: "🎓",
      recommendation: "📝",
      photo: "📷",
      other: "📄",
    };
    return icons[category] || "📄";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📕";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("word")) return "📘";
    return "📄";
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="section-box mb-30">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-2">Belge Cüzdanım</h2>
                  <p className="text-muted">
                    Burs başvurularında kullanmak üzere belgelerinizi yükleyin
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowUploadModal(true)}
                >
                  + Belge Yükle
                </button>
              </div>

              {/* Storage Info */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Depolama Kullanımı</span>
                    <span className="text-muted">
                      {(totalSize / 1024 / 1024).toFixed(2)} MB / 100 MB
                    </span>
                  </div>
                  <div className="progress" style={{ height: 20 }}>
                    <div
                      className={`progress-bar ${
                        usagePercent > 80 ? "bg-danger" : "bg-primary"
                      }`}
                      role="progressbar"
                      style={{ width: `${usagePercent}%` }}
                      aria-valuenow={usagePercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {usagePercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters & View Toggle */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="btn-group">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`btn ${
                        selectedCategory === cat
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === "all" ? "Tümü" : getCategoryIcon(cat)}{" "}
                      {cat === "all" && `(${documents.length})`}
                    </button>
                  ))}
                </div>
                <div className="btn-group">
                  <button
                    className={`btn ${
                      viewMode === "grid" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    className={`btn ${
                      viewMode === "list" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    ☰ Liste
                  </button>
                </div>
              </div>

              {/* Documents */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Henüz belge yüklenmemiş</p>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowUploadModal(true)}
                  >
                    İlk Belgeyi Yükle
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="row">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="col-md-4 col-lg-3 mb-4">
                      <div className="card h-100 hover-shadow">
                        <div className="card-body text-center">
                          <div className="mb-3" style={{ fontSize: 48 }}>
                            {getFileIcon(doc.file_type)}
                          </div>
                          <h6 className="card-title">{doc.document_name}</h6>
                          <p className="text-muted small mb-2">
                            {getCategoryIcon(doc.category)} {doc.category}
                          </p>
                          <p className="text-muted small">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {doc.verified && (
                            <span className="badge bg-success mb-2">✓ Doğrulandı</span>
                          )}
                          <div className="btn-group w-100 mt-2">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              Görüntüle
                            </a>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => downloadDocument(doc)}
                            >
                              İndir
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <div className="card-footer bg-light text-muted small">
                          {new Date(doc.created_at).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="list-group">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center flex-grow-1">
                          <span className="me-3" style={{ fontSize: 32 }}>
                            {getFileIcon(doc.file_type)}
                          </span>
                          <div>
                            <h6 className="mb-1">{doc.document_name}</h6>
                            <small className="text-muted">
                              {getCategoryIcon(doc.category)} {doc.category} •{" "}
                              {(doc.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                              {new Date(doc.created_at).toLocaleDateString("tr-TR")}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {doc.verified && (
                            <span className="badge bg-success">✓ Doğrulandı</span>
                          )}
                          <div className="btn-group">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              Görüntüle
                            </a>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => downloadDocument(doc)}
                            >
                              İndir
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUpload
          studentId={student!.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchDocuments();
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}

