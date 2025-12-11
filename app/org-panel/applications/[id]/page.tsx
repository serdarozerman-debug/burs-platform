"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Application } from "@/types/application";
import type { Student } from "@/types/student";
import type { WalletDocument } from "@/types/wallet";

type ApplicationDetails = Application & {
  student?: Student;
  scholarship?: {
    title: string;
    amount: number;
    description: string;
  };
  documents?: WalletDocument[];
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId]);

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);

      // Fetch application with relations
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select(
          `
          *,
          student:student_id (
            *
          ),
          scholarship:scholarship_id (
            title,
            amount,
            description
          )
        `
        )
        .eq("id", applicationId)
        .single();

      if (appError) throw appError;

      // Fetch student's documents
      if (appData.student_id) {
        const { data: docs } = await supabase
          .from("wallet_documents")
          .select("*")
          .eq("student_id", appData.student_id)
          .eq("is_deleted", false);

        setApplication({ ...appData, documents: docs || [] });
      } else {
        setApplication(appData);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      alert("Başvuru yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: Application["status"]) => {
    if (!confirm(`Bu başvuruyu ${getStatusLabel(newStatus)} olarak işaretlemek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      // Create notification for student
      await supabase.from("notifications").insert({
        user_id: application!.student!.user_id,
        title: `Başvuru Durumu Güncellendi`,
        message: `${application!.scholarship!.title} başvurunuz ${getStatusLabel(newStatus)} durumuna geçti.`,
        type: newStatus === "approved" ? "success" : newStatus === "rejected" ? "error" : "info",
      });

      alert("Durum başarıyla güncellendi!");
      fetchApplicationDetail();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Durum güncellenirken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from("applications")
        .update({
          reviewer_notes: comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      alert("Yorum eklendi!");
      setComment("");
      fetchApplicationDetail();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Yorum eklenirken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: Application["status"]) => {
    const labels = {
      pending: "Beklemede",
      reviewing: "İnceleniyor",
      approved: "Onaylandı",
      rejected: "Reddedildi",
      withdrawn: "Geri Çekildi",
    };
    return labels[status];
  };

  const getStatusBadge = (status: Application["status"]) => {
    const badges = {
      pending: "bg-warning",
      reviewing: "bg-info",
      approved: "bg-success",
      rejected: "bg-danger",
      withdrawn: "bg-secondary",
    };
    return `badge ${badges[status]}`;
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <h3>Başvuru bulunamadı</h3>
          <button onClick={() => router.back()} className="btn btn-primary mt-3">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <button onClick={() => router.back()} className="btn btn-link ps-0">
              ← Geri
            </button>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-2">Başvuru Detayı</h2>
                <span className={getStatusBadge(application.status)}>
                  {getStatusLabel(application.status)}
                </span>
              </div>
              <div className="btn-group">
                {application.status !== "approved" && (
                  <button
                    className="btn btn-success"
                    onClick={() => updateStatus("approved")}
                    disabled={submitting}
                  >
                    ✓ Onayla
                  </button>
                )}
                {application.status !== "rejected" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus("rejected")}
                    disabled={submitting}
                  >
                    ✕ Reddet
                  </button>
                )}
                {application.status === "pending" && (
                  <button
                    className="btn btn-info"
                    onClick={() => updateStatus("reviewing")}
                    disabled={submitting}
                  >
                    👁 İncelemeye Al
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            {/* Left Column - Student Info */}
            <div className="col-lg-8">
              {/* Student Profile Card */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Öğrenci Bilgileri</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-start mb-4">
                    {application.student?.profile_photo_url ? (
                      <img
                        src={application.student.profile_photo_url}
                        alt={application.student.full_name}
                        className="rounded-circle me-3"
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: 80, height: 80, fontSize: 32 }}
                      >
                        {application.student?.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div>
                      <h4 className="mb-1">{application.student?.full_name}</h4>
                      <p className="text-muted mb-2">{application.student?.email}</p>
                      <p className="text-muted mb-0">{application.student?.phone}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Üniversite:</strong> {application.student?.university}
                      </p>
                      <p>
                        <strong>Bölüm:</strong> {application.student?.department}
                      </p>
                      <p>
                        <strong>Sınıf:</strong> {application.student?.grade}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>GPA:</strong>{" "}
                        <span className="badge bg-info fs-6">
                          {application.student?.gpa || "-"}
                        </span>
                      </p>
                      <p>
                        <strong>Doğum Tarihi:</strong>{" "}
                        {application.student?.birth_date
                          ? new Date(application.student.birth_date).toLocaleDateString("tr-TR")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship Info */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Başvurulan Burs</h5>
                </div>
                <div className="card-body">
                  <h4>{application.scholarship?.title}</h4>
                  <p className="text-muted">{application.scholarship?.description}</p>
                  <p className="fs-4 text-primary mb-0">
                    <strong>
                      {application.scholarship?.amount?.toLocaleString("tr-TR")} ₺
                    </strong>
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Belgeler</h5>
                </div>
                <div className="card-body">
                  {!application.documents || application.documents.length === 0 ? (
                    <p className="text-muted">Henüz belge yüklenmemiş</p>
                  ) : (
                    <div className="row">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="col-md-6 mb-3">
                          <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{doc.document_name}</h6>
                                <small className="text-muted">
                                  {doc.category} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                                </small>
                              </div>
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                Görüntüle
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Application Data */}
              {application.application_data && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">Ek Bilgiler</h5>
                  </div>
                  <div className="card-body">
                    <pre className="bg-light p-3 rounded">
                      {JSON.stringify(application.application_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="col-lg-4">
              {/* Timeline */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Zaman Çizelgesi</h5>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    <div className="timeline-item">
                      <strong>Başvuru Tarihi</strong>
                      <p className="text-muted mb-0">
                        {new Date(application.created_at).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    {application.reviewed_at && (
                      <div className="timeline-item mt-3">
                        <strong>İnceleme Tarihi</strong>
                        <p className="text-muted mb-0">
                          {new Date(application.reviewed_at).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    )}
                    <div className="timeline-item mt-3">
                      <strong>Son Güncelleme</strong>
                      <p className="text-muted mb-0">
                        {new Date(application.updated_at).toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">İnceleme Notları</h5>
                </div>
                <div className="card-body">
                  {application.reviewer_notes && (
                    <div className="alert alert-info">
                      <p className="mb-0">{application.reviewer_notes}</p>
                    </div>
                  )}
                  <textarea
                    className="form-control mb-3"
                    rows={4}
                    placeholder="Not ekle..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="btn btn-primary w-100"
                    onClick={addComment}
                    disabled={submitting || !comment.trim()}
                  >
                    Not Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

