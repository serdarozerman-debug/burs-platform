"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface DocumentUploadProps {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DocumentUpload({
  studentId,
  onClose,
  onSuccess,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [documentName, setDocumentName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "identity", label: "🪪 Kimlik Belgesi" },
    { value: "transcript", label: "📊 Not Dökümü (Transcript)" },
    { value: "income", label: "💰 Gelir Belgesi" },
    { value: "student_certificate", label: "🎓 Öğrenci Belgesi" },
    { value: "recommendation", label: "📝 Referans Mektubu" },
    { value: "photo", label: "📷 Fotoğraf" },
    { value: "other", label: "📄 Diğer" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Sadece PDF ve resim dosyaları (JPG, PNG, WEBP) yükleyebilirsiniz");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      alert("Dosya boyutu en fazla 10MB olabilir");
      return;
    }

    setFile(selectedFile);
    if (!documentName) {
      setDocumentName(selectedFile.name.split(".")[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !category || !documentName.trim()) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${studentId}/${category}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: _uploadData, error: uploadError } = await supabase.storage
        .from("student-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("student-documents").getPublicUrl(fileName);

      setUploadProgress(75);

      // Save metadata to database
      const { error: dbError } = await supabase.from("wallet_documents").insert({
        student_id: studentId,
        document_name: documentName,
        category: category,
        file_url: publicUrl,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
        verified: false,
        is_deleted: false,
      });

      if (dbError) throw dbError;

      setUploadProgress(100);

      alert("Belge başarıyla yüklendi!");
      onSuccess();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Belge yüklenirken hata oluştu");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Belge Yükle</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={uploading}
            />
          </div>
          <div className="modal-body">
            {/* Drag & Drop Zone */}
            <div
              className={`border border-3 rounded p-5 text-center mb-4 ${
                dragActive ? "border-primary bg-light" : "border-dashed"
              }`}
              style={{
                borderStyle: "dashed",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileInputChange}
              />
              {file ? (
                <div>
                  <div className="mb-3" style={{ fontSize: 48 }}>
                    {file.type.includes("pdf") ? "📕" : "🖼️"}
                  </div>
                  <h5>{file.name}</h5>
                  <p className="text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Değiştir
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3" style={{ fontSize: 48 }}>
                    📤
                  </div>
                  <h5>Dosya Sürükle veya Tıkla</h5>
                  <p className="text-muted">
                    PDF, JPG, PNG, WEBP (Maks. 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-3">
              <label className="form-label">
                Belge Kategorisi <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploading}
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Name */}
            <div className="mb-3">
              <label className="form-label">
                Belge Adı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: Nüfus Cüzdanı, 2024 Güz Dönemi Transkript"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-3">
                <div className="progress" style={{ height: 25 }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="alert alert-info">
              <small>
                <strong>💡 İpucu:</strong> Yüklenen belgeler burs başvurularında
                otomatik olarak kullanılabilir. Belgelerinizin güncel ve net
                olmasına dikkat edin.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={uploading}
            >
              İptal
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!file || !category || !documentName.trim() || uploading}
            >
              {uploading ? "Yükleniyor..." : "Yükle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

