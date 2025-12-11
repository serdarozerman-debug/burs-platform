"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import { supabase } from "@/lib/supabase";
import type { WalletDocument } from "@/types/wallet";

interface ScholarshipData {
  id: string;
  title: string;
  organization: string;
  amount: number;
  description: string;
  deadline: string;
  required_documents?: string[];
}

export default function ApplicationWizardPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { student } = useStudent();
  const scholarshipId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [scholarship, setScholarship] = useState<ScholarshipData | null>(null);
  const [documents, setDocuments] = useState<WalletDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Personal Info (auto-filled)
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    
    // Step 2: Education Info
    university: "",
    department: "",
    grade: "",
    gpa: "",
    
    // Step 3: Selected Documents
    selectedDocuments: [] as string[],
    
    // Step 4: Additional Info
    essay: "",
    whyThisScholarship: "",
    achievements: "",
  });

  useEffect(() => {
    if (scholarshipId && student?.id) {
      fetchData();
    }
  }, [scholarshipId, student?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch scholarship
      const { data: scholarshipData, error: scholarshipError } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", scholarshipId)
        .single();

      if (scholarshipError) throw scholarshipError;
      setScholarship(scholarshipData);

      // Fetch student's documents
      const { data: docsData, error: docsError } = await supabase
        .from("wallet_documents")
        .select("*")
        .eq("student_id", student!.id)
        .eq("is_deleted", false);

      if (docsError) throw docsError;
      setDocuments(docsData || []);

      // Pre-fill personal info
      setFormData((prev) => ({
        ...prev,
        fullName: student!.full_name || "",
        email: student!.email || "",
        phone: student!.phone || "",
        birthDate: student!.birth_date || "",
        university: student!.university || "",
        department: student!.department || "",
        grade: student!.grade || "",
        gpa: student!.gpa?.toString() || "",
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert("Lütfen tüm alanları doldurun");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.university || !formData.department || !formData.gpa) {
        alert("Lütfen tüm alanları doldurun");
        return;
      }
    } else if (currentStep === 3) {
      if (formData.selectedDocuments.length === 0) {
        alert("Lütfen en az bir belge seçin");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.whyThisScholarship.trim()) {
      alert("Lütfen neden bu bursu istediğinizi yazın");
      return;
    }

    if (!confirm("Başvurunuzu göndermek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase.from("applications").insert({
        student_id: student!.id,
        scholarship_id: scholarshipId,
        status: "pending",
        application_data: {
          personal: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            birthDate: formData.birthDate,
          },
          education: {
            university: formData.university,
            department: formData.department,
            grade: formData.grade,
            gpa: parseFloat(formData.gpa),
          },
          documents: formData.selectedDocuments,
          additional: {
            essay: formData.essay,
            whyThisScholarship: formData.whyThisScholarship,
            achievements: formData.achievements,
          },
        },
      });

      if (error) throw error;

      alert("Başvurunuz başarıyla gönderildi!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Başvuru gönderilirken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocuments: prev.selectedDocuments.includes(docId)
        ? prev.selectedDocuments.filter((id) => id !== docId)
        : [...prev.selectedDocuments, docId],
    }));
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

  if (!scholarship) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <h3>Burs bulunamadı</h3>
          <button onClick={() => router.back()} className="btn btn-primary mt-3">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = 5;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="mb-4">
            <button onClick={() => router.back()} className="btn btn-link ps-0">
              ← Geri
            </button>
            <h2 className="mb-2">Burs Başvurusu</h2>
            <h4 className="text-muted">{scholarship.title}</h4>
            <p className="text-muted">{scholarship.organization}</p>
          </div>

          {/* Step Indicator */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className="d-flex align-items-center"
                    style={{ flex: 1 }}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        step === currentStep
                          ? "bg-primary text-white"
                          : step < currentStep
                          ? "bg-success text-white"
                          : "bg-light text-muted"
                      }`}
                      style={{ width: 40, height: 40, fontWeight: "bold" }}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < totalSteps && (
                      <div
                        className="flex-grow-1 mx-2"
                        style={{
                          height: 2,
                          backgroundColor:
                            step < currentStep ? "#28a745" : "#dee2e6",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className={currentStep === 1 ? "fw-bold" : "text-muted"}>
                  Kişisel Bilgiler
                </small>
                <small className={currentStep === 2 ? "fw-bold" : "text-muted"}>
                  Eğitim Bilgileri
                </small>
                <small className={currentStep === 3 ? "fw-bold" : "text-muted"}>
                  Belgeler
                </small>
                <small className={currentStep === 4 ? "fw-bold" : "text-muted"}>
                  Ek Bilgiler
                </small>
                <small className={currentStep === 5 ? "fw-bold" : "text-muted"}>
                  Önizleme
                </small>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="card mb-4">
            <div className="card-body">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div>
                  <h5 className="mb-4">Kişisel Bilgiler</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Ad Soyad <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        E-posta <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Telefon <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Doğum Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({ ...formData, birthDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education Info */}
              {currentStep === 2 && (
                <div>
                  <h5 className="mb-4">Eğitim Bilgileri</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Üniversite <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.university}
                        onChange={(e) =>
                          setFormData({ ...formData, university: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Bölüm <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sınıf</label>
                      <select
                        className="form-select"
                        value={formData.grade}
                        onChange={(e) =>
                          setFormData({ ...formData, grade: e.target.value })
                        }
                      >
                        <option value="">Seçin</option>
                        <option value="Hazırlık">Hazırlık</option>
                        <option value="1">1. Sınıf</option>
                        <option value="2">2. Sınıf</option>
                        <option value="3">3. Sınıf</option>
                        <option value="4">4. Sınıf</option>
                        <option value="5+">5. Sınıf ve üzeri</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        GPA (Not Ortalaması) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        className="form-control"
                        value={formData.gpa}
                        onChange={(e) =>
                          setFormData({ ...formData, gpa: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Selection */}
              {currentStep === 3 && (
                <div>
                  <h5 className="mb-4">Belgeler</h5>
                  <p className="text-muted mb-4">
                    Başvurunuzda kullanmak istediğiniz belgeleri seçin
                  </p>
                  {documents.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        Cüzdanınızda henüz belge bulunmuyor
                      </p>
                      <a href="/wallet" className="btn btn-primary">
                        Belge Yükle
                      </a>
                    </div>
                  ) : (
                    <div className="row">
                      {documents.map((doc) => (
                        <div key={doc.id} className="col-md-6 mb-3">
                          <div
                            className={`border rounded p-3 ${
                              formData.selectedDocuments.includes(doc.id)
                                ? "border-primary bg-light"
                                : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleDocument(doc.id)}
                          >
                            <div className="d-flex align-items-start">
                              <input
                                type="checkbox"
                                className="form-check-input me-3 mt-1"
                                checked={formData.selectedDocuments.includes(doc.id)}
                                onChange={() => {}}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{doc.document_name}</h6>
                                <small className="text-muted">
                                  {doc.category} •{" "}
                                  {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                                </small>
                                {doc.verified && (
                                  <span className="badge bg-success ms-2">
                                    ✓ Doğrulandı
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Additional Info */}
              {currentStep === 4 && (
                <div>
                  <h5 className="mb-4">Ek Bilgiler</h5>
                  <div className="mb-3">
                    <label className="form-label">
                      Neden bu bursu istiyorsunuz?{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Bursu kazanmanız halinde size nasıl katkı sağlayacağını açıklayın..."
                      value={formData.whyThisScholarship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whyThisScholarship: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Kişisel Başarılarınız</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Akademik, sosyal veya kişisel başarılarınızı paylaşın..."
                      value={formData.achievements}
                      onChange={(e) =>
                        setFormData({ ...formData, achievements: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Ek Açıklamalar (İsteğe bağlı)
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Eklemek istediğiniz başka bilgiler varsa buraya yazabilirsiniz..."
                      value={formData.essay}
                      onChange={(e) =>
                        setFormData({ ...formData, essay: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Preview */}
              {currentStep === 5 && (
                <div>
                  <h5 className="mb-4">Başvuru Önizleme</h5>
                  
                  <div className="alert alert-info">
                    <strong>ℹ️ Başvurunuzu göndermeden önce kontrol edin</strong>
                  </div>

                  <h6 className="mt-4">Kişisel Bilgiler</h6>
                  <ul className="list-unstyled">
                    <li><strong>Ad Soyad:</strong> {formData.fullName}</li>
                    <li><strong>E-posta:</strong> {formData.email}</li>
                    <li><strong>Telefon:</strong> {formData.phone}</li>
                    {formData.birthDate && (
                      <li>
                        <strong>Doğum Tarihi:</strong>{" "}
                        {new Date(formData.birthDate).toLocaleDateString("tr-TR")}
                      </li>
                    )}
                  </ul>

                  <h6 className="mt-4">Eğitim Bilgileri</h6>
                  <ul className="list-unstyled">
                    <li><strong>Üniversite:</strong> {formData.university}</li>
                    <li><strong>Bölüm:</strong> {formData.department}</li>
                    <li><strong>Sınıf:</strong> {formData.grade}</li>
                    <li><strong>GPA:</strong> {formData.gpa}</li>
                  </ul>

                  <h6 className="mt-4">Seçilen Belgeler</h6>
                  <ul className="list-unstyled">
                    {formData.selectedDocuments.map((docId) => {
                      const doc = documents.find((d) => d.id === docId);
                      return (
                        <li key={docId}>
                          • {doc?.document_name} ({doc?.category})
                        </li>
                      );
                    })}
                  </ul>

                  <h6 className="mt-4">Neden Bu Burs?</h6>
                  <p className="bg-light p-3 rounded">{formData.whyThisScholarship}</p>

                  {formData.achievements && (
                    <>
                      <h6 className="mt-4">Başarılar</h6>
                      <p className="bg-light p-3 rounded">{formData.achievements}</p>
                    </>
                  )}

                  {formData.essay && (
                    <>
                      <h6 className="mt-4">Ek Açıklamalar</h6>
                      <p className="bg-light p-3 rounded">{formData.essay}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleBack}
                  disabled={currentStep === 1 || submitting}
                >
                  ← Geri
                </button>
                {currentStep < totalSteps ? (
                  <button className="btn btn-primary" onClick={handleNext}>
                    İleri →
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Gönderiliyor..." : "Başvuruyu Gönder ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

