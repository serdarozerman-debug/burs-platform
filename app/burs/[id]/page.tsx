"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { Scholarship } from "@/lib/supabase";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`/api/scholarships/${params.id}`);
        if (!response.ok) throw new Error("Burs bulunamadı");
        const data = await response.json();
        setScholarship(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
              <p className="mt-20">Burs detayları yükleniyor...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!scholarship) {
    return (
      <Layout>
        <div className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-center">
              <h2>Burs bulunamadı</h2>
              <Link href="/">
                <span className="btn btn-default mt-20">Ana Sayfaya Dön</span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-box mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Main Content */}
              <div className="content-single">
                {/* Breadcrumb */}
                <div className="mb-30">
                  <Link href="/" className="color-text-paragraph-2">
                    Ana Sayfa
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="color-brand-2">{scholarship.title}</span>
                </div>

                {/* Header */}
                <div className="card-grid-2 hover-up mb-40">
                  <div className="card-grid-2-image-left">
                    <div className="image-box">
                      {scholarship.organization?.logo_url ? (
                        <img src={scholarship.organization?.logo_url} alt={scholarship.organization?.name || 'Organization'} />
                      ) : (
                        <div style={{ 
                          width: "80px",
                          height: "80px",
                          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "32px",
                          fontWeight: "bold",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}>
                          {(scholarship.organization?.name || 'K').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="right-info">
                      <span className="name-job">{scholarship.organization?.name || 'Kurum'}</span>
                      <span className="location-small">İstanbul, TR</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="color-brand-1 mb-20">{scholarship.title}</h2>

                {/* Meta Info */}
                <div className="border-bottom pt-10 pb-10 mb-30">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="sidebar-list-job">
                        <ul>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-briefcase"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">Burs Türü</span>
                              <strong className="small-heading">{scholarship.type}</strong>
                            </div>
                          </li>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-graduation-cap"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">Eğitim Seviyesi</span>
                              <strong className="small-heading">{scholarship.education_level}</strong>
                            </div>
                          </li>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-calendar"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">Son Başvuru</span>
                              <strong className="small-heading">{formatDate(scholarship.deadline)}</strong>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="sidebar-list-job">
                        <ul>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-money"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">Burs Miktarı</span>
                              <strong className="small-heading">
                                {scholarship.amount.toLocaleString("tr-TR")} ₺ / {scholarship.amount_type}
                              </strong>
                            </div>
                          </li>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-marker"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">Kurum</span>
                              <strong className="small-heading">{scholarship.organization?.name || 'Kurum'}</strong>
                            </div>
                          </li>
                          <li>
                            <div className="sidebar-icon-item">
                              <i className="fi-rr-time-fast"></i>
                            </div>
                            <div className="sidebar-text-info">
                              <span className="text-description">İlan Tarihi</span>
                              <strong className="small-heading">
                                {new Date(scholarship.created_at).toLocaleDateString("tr-TR")}
                              </strong>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="content-single">
                  <h4 className="mb-20">Burs Açıklaması</h4>
                  <p className="font-md color-text-paragraph-2">{scholarship.description}</p>

                  <h4 className="mt-40 mb-20">Başvuru Bilgileri</h4>
                  <p className="font-md color-text-paragraph-2">
                    Bu burs için başvurular <strong>{formatDate(scholarship.deadline)}</strong> tarihine kadar kabul edilmektedir.
                  </p>

                  {/* Apply Section */}
                  <div className="single-apply-jobs mt-40">
                    <div className="row">
                      <div className="col-md-6">
                        <Link href="/">
                          <span className="btn btn-default">← Listeye Dön</span>
                        </Link>
                      </div>
                      <div className="col-md-6 text-end">
                        <a
                          href={scholarship.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-apply-now"
                        >
                          Başvuru Yap
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sidebar-shadow none-shadow mb-30">
                <div className="sidebar-filters">
                  <div className="filter-block mb-30">
                    <h5 className="medium-heading mb-15">Hızlı Bilgiler</h5>
                    <div className="job-overview">
                      <div className="job-overview-card">
                        <div className="job-overview-icon">
                          <i className="fi-rr-dollar"></i>
                        </div>
                        <div className="job-overview-text">
                          <span className="job-overview-title">Burs Miktarı</span>
                          <span className="job-overview-value">
                            {scholarship.amount.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>
                      <div className="job-overview-card">
                        <div className="job-overview-icon">
                          <i className="fi-rr-calendar"></i>
                        </div>
                        <div className="job-overview-text">
                          <span className="job-overview-title">Ödeme Tipi</span>
                          <span className="job-overview-value">{scholarship.amount_type}</span>
                        </div>
                      </div>
                      <div className="job-overview-card">
                        <div className="job-overview-icon">
                          <i className="fi-rr-briefcase"></i>
                        </div>
                        <div className="job-overview-text">
                          <span className="job-overview-title">Burs Türü</span>
                          <span className="job-overview-value">{scholarship.type}</span>
                        </div>
                      </div>
                      <div className="job-overview-card">
                        <div className="job-overview-icon">
                          <i className="fi-rr-graduation-cap"></i>
                        </div>
                        <div className="job-overview-text">
                          <span className="job-overview-title">Eğitim</span>
                          <span className="job-overview-value">{scholarship.education_level}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="filter-block mb-30">
                    <h5 className="medium-heading mb-15">Paylaş</h5>
                    <div className="social-share">
                      <a href="#" className="share-facebook"></a>
                      <a href="#" className="share-twitter"></a>
                      <a href="#" className="share-linkedin"></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

