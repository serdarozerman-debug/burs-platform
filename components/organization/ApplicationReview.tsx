"use client";

import { useState } from "react";
import type { Application } from "@/types/application";

interface ApplicationReviewProps {
  application: Application;
  onStatusChange: (status: Application["status"]) => Promise<void>;
  onAddNote: (note: string) => Promise<void>;
}

export default function ApplicationReview({
  application,
  onStatusChange,
  onAddNote,
}: ApplicationReviewProps) {
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Bu başvuruyu onaylamak istediğinizden emin misiniz?")) return;
    
    setSubmitting(true);
    try {
      await onStatusChange("approved");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      alert("Reddetme nedeni girmelisiniz");
      return;
    }
    
    if (!confirm("Bu başvuruyu reddetmek istediğinizden emin misiniz?")) return;

    setSubmitting(true);
    try {
      await onAddNote(note);
      await onStatusChange("rejected");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async () => {
    setSubmitting(true);
    try {
      await onStatusChange("reviewing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    setSubmitting(true);
    try {
      await onAddNote(note);
      setNote("");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: Application["status"]) => {
    const colors = {
      pending: "warning",
      reviewing: "info",
      approved: "success",
      rejected: "danger",
      withdrawn: "secondary",
    };
    return colors[status];
  };

  return (
    <div className="application-review">
      {/* Current Status */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Başvuru Durumu</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className={`badge bg-${getStatusColor(application.status)} fs-6`}>
                {application.status === "pending" && "Beklemede"}
                {application.status === "reviewing" && "İnceleniyor"}
                {application.status === "approved" && "Onaylandı"}
                {application.status === "rejected" && "Reddedildi"}
                {application.status === "withdrawn" && "Geri Çekildi"}
              </span>
            </div>
            <div>
              <small className="text-muted">
                Son güncelleme:{" "}
                {new Date(application.updated_at).toLocaleString("tr-TR")}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Belge Kontrol Listesi</h5>
        </div>
        <div className="card-body">
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="doc1" />
            <label className="form-check-label" htmlFor="doc1">
              Kimlik Belgesi
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="doc2" />
            <label className="form-check-label" htmlFor="doc2">
              Öğrenci Belgesi
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="doc3" />
            <label className="form-check-label" htmlFor="doc3">
              Not Dökümü (Transcript)
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="doc4" />
            <label className="form-check-label" htmlFor="doc4">
              Gelir Belgesi
            </label>
          </div>
        </div>
      </div>

      {/* Rating System */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Değerlendirme</h5>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <span className="me-3">Puan:</span>
            <div className="btn-group" role="group">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn ${
                    rating >= star ? "btn-warning" : "btn-outline-warning"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <p className="text-muted mb-0">
            {rating === 0 && "Başvuruyu değerlendirin"}
            {rating === 1 && "Zayıf"}
            {rating === 2 && "Orta"}
            {rating === 3 && "İyi"}
            {rating === 4 && "Çok İyi"}
            {rating === 5 && "Mükemmel"}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Notlar</h5>
        </div>
        <div className="card-body">
          {application.reviewer_notes && (
            <div className="alert alert-info mb-3">
              <strong>Mevcut Not:</strong>
              <p className="mb-0 mt-2">{application.reviewer_notes}</p>
            </div>
          )}
          <textarea
            className="form-control mb-3"
            rows={5}
            placeholder="İnceleme notlarınızı buraya yazın..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="btn btn-outline-primary"
            onClick={handleSaveNote}
            disabled={submitting || !note.trim()}
          >
            Not Kaydet
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">İşlemler</h5>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2">
            {application.status === "pending" && (
              <button
                className="btn btn-info btn-lg"
                onClick={handleReview}
                disabled={submitting}
              >
                👁 İncelemeye Al
              </button>
            )}
            
            {application.status !== "approved" && (
              <button
                className="btn btn-success btn-lg"
                onClick={handleApprove}
                disabled={submitting}
              >
                ✓ Başvuruyu Onayla
              </button>
            )}
            
            {application.status !== "rejected" && (
              <button
                className="btn btn-danger btn-lg"
                onClick={handleReject}
                disabled={submitting || !note.trim()}
              >
                ✕ Başvuruyu Reddet
              </button>
            )}

            {submitting && (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">İşleniyor...</span>
                </div>
              </div>
            )}
          </div>
          
          {application.status !== "rejected" && !note.trim() && (
            <p className="text-muted small mt-3 mb-0">
              * Reddetme için not yazmalısınız
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

