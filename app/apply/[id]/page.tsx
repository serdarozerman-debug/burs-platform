"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import { Scholarship } from "@/lib/supabase";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`/api/scholarships/${params.id}`);
        if (!response.ok) throw new Error("Burs bulunamadı");
        const data = await response.json();
        
        // API entegrasyonu yoksa kurumun kendi sayfasına yönlendir
        if (!data.has_api_integration) {
          window.location.href = data.application_url;
          return;
        }
        
        setScholarship(data);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarship_id: params.id,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Başvuru gönderilemedi");

      alert("Başvurunuz başarıyla gönderildi!");
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-20">Burs bilgileri yükleniyor...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!scholarship) {
    return null;
  }

  return (
    <Layout>
      <div className="section-box mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {/* Scholarship Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {scholarship.organization_logo ? (
                      <img
                        src={scholarship.organization_logo}
                        alt={scholarship.organization}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {scholarship.organization.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {scholarship.organization}
                    </h4>
                    <h2 className="text-3xl font-bold text-blue-600 mb-2">
                      {scholarship.title}
                    </h2>
                    <p className="text-gray-600">{scholarship.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Burs Miktarı</p>
                    <p className="text-xl font-bold text-blue-600">
                      {scholarship.amount.toLocaleString("tr-TR")} ₺ / {scholarship.amount_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Son Başvuru Tarihi</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(scholarship.deadline).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Başvuru Formu</h3>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label font-semibold text-gray-700">Ad</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="form-control h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        placeholder="Adınız"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label font-semibold text-gray-700">Soyad</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="form-control h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label font-semibold text-gray-700">E-posta</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label font-semibold text-gray-700">Telefon</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-control h-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        placeholder="0555 555 55 55"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label font-semibold text-gray-700">Başvuru Mesajı (Opsiyonel)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="form-control border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                      placeholder="Kendiniz hakkında kısaca bilgi verin..."
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>Not:</strong> Bu başvuru formu {scholarship.organization} kurumu ile API entegrasyonu sayesinde doğrudan sistemimiz üzerinden yapılmaktadır. Başvurunuz kuruma iletilecektir.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

