/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import CategorySlider from "@/components/sliders/Category";
import TopRekruterSlider from "@/components/sliders/TopRekruter";
import BlogSlider from "@/components/sliders/Blog";
import CategoryTab from "@/components/elements/CategoryTab";
import Link from "next/link";
import { Scholarship } from "@/lib/supabase";
import ScholarshipFilters, { FilterState } from "@/components/ScholarshipFilters";

export default function Home() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: [],
    education_level: [],
    organization: [],
    min_amount: 0,
    max_amount: 25000,
    days_left: null,
  });

  // Fetch scholarships with pagination
  const fetchScholarships = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", ITEMS_PER_PAGE.toString());
      
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.type.length > 0) {
        filters.type.forEach((type) => {
          queryParams.append("type", type);
        });
      }
      if (filters.education_level.length > 0) {
        filters.education_level.forEach((level) => {
          queryParams.append("education_level", level);
        });
      }
      if (filters.organization.length > 0) {
        filters.organization.forEach((org) => {
          queryParams.append("organization", org);
        });
      }
      if (filters.min_amount > 0) {
        queryParams.append("min_amount", filters.min_amount.toString());
      }
      if (filters.max_amount < 25000) {
        queryParams.append("max_amount", filters.max_amount.toString());
      }
      if (filters.days_left !== null) {
        queryParams.append("days_left", filters.days_left.toString());
      }

      const url = `/api/scholarships?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch scholarships");
      const result = await response.json();
      
      setScholarships(result.data || []);
      setTotalCount(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchScholarships(1);
  }, [filters]);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchScholarships(currentPage);
    }
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Pagination artık API'den geliyor, slice'a gerek yok
  const currentScholarships = scholarships;

  // Scroll to scholarships section when page changes
  useEffect(() => {
    const element = document.getElementById('scholarships-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  return (
    <>
      <Layout>
        <div className="bg-homepage1" />
        
        {/* Hero Section - Microfon Style */}
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center mb-50">
              <h1 className="heading-banner wow animate__animated animate__fadeInUp" style={{ fontSize: "48px", fontWeight: "700" }}>
                Sana Uygun <span className="color-brand-2">Bursları Bul!</span>
              </h1>
              <div className="banner-description mt-20 wow animate__animated animate__fadeInUp" data-wow-delay=".1s" style={{ maxWidth: "800px", margin: "20px auto" }}>
                Yurtiçi ve yurtdışındaki üniversite burslarına ve diğer tüm burslara kolayca ulaş! 
                Burs başvuruları, yüksek lisans bursları, karşılıksız ve geri ödemesiz burs başvuruları 
                ne zaman yapılıyor öğren ve hemen sana uygun burslara başvur.
              </div>
              
              {/* Search and Filter Bar */}
              <div className="mt-40 wow animate__animated animate__fadeIn" data-wow-delay=".2s">
                <div className="bg-light p-4 rounded-3" style={{ maxWidth: "900px", margin: "0 auto" }}>
                  <form className="row g-3 align-items-end">
                    <div className="col-md-3">
                      <input 
                        type="text" 
                        className="form-control form-input"
                        placeholder="Burs Adı"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                    <div className="col-md-2">
                      <select className="form-control form-input select-active">
                        <option value="">Ülke</option>
                        <option value="TR">Türkiye</option>
                        <option value="US">ABD</option>
                        <option value="GB">İngiltere</option>
                        <option value="DE">Almanya</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select 
                        className="form-control form-input select-active"
                        value={filters.education_level[0] || ""}
                        onChange={(e) => setFilters({...filters, education_level: e.target.value ? [e.target.value] : []})}
                      >
                        <option value="">Eğitim Seviyesi</option>
                        <option value="lise">Lise</option>
                        <option value="lisans">Lisans</option>
                        <option value="yükseklisans">Yüksek Lisans</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select 
                        className="form-control form-input select-active"
                        value={filters.organization[0] || ""}
                        onChange={(e) => setFilters({...filters, organization: e.target.value ? [e.target.value] : []})}
                      >
                        <option value="">Okul/Kurum</option>
                        <option value="TÜBİTAK">TÜBİTAK</option>
                        <option value="Türk Eğitim Vakfı">TEV</option>
                        <option value="Vehbi Koç Vakfı">VKV</option>
                        <option value="Sabancı Vakfı">Sabancı Vakfı</option>
                      </select>
                    </div>
                    <div className="col-md-1">
                      <button 
                        type="button"
                        onClick={() => {
                          const element = document.getElementById('scholarships-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="btn btn-default w-100"
                      >
                        Ara
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diğer bölümleri kaldır, sadece burs listesine devam et */}
        <section id="scholarships-section" className="section-box mt-50">
          <div className="container">
            <div className="text-center mb-30">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Öne Çıkan Burslar</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">En çok aranan burs fırsatlarını keşfet</p>
            </div>
            
            <div className="row">
              <div className="col-lg-3 col-md-12 mb-30">
                <ScholarshipFilters
                  onFilterChange={setFilters}
                  currentFilters={filters}
                />
              </div>
              <div className="col-lg-9 col-md-12" style={{ minHeight: "auto" }}>
                {loading ? (
                  <div className="text-center mt-50">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p className="mt-20">Burslar yükleniyor...</p>
                  </div>
                ) : scholarships.length > 0 ? (
                  <>
                    <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
                        {currentScholarships.map((scholarship, index) => {
                        // Evrak gruplaması
                        const getRequiredDocuments = () => {
                          const documents: string[] = [];
                          if (scholarship.type === "akademik") {
                            documents.push("Transkript", "Not Belgesi");
                          } else if (scholarship.type === "engelli") {
                            documents.push("Engelli Raporu", "Sağlık Raporu");
                          } else if (scholarship.type === "ihtiyaç") {
                            documents.push("Gelir Belgesi", "Aile Durum Belgesi");
                          }
                          if (scholarship.education_level === "lise") {
                            documents.push("Lise Diploması");
                          } else if (scholarship.education_level === "lisans") {
                            documents.push("Lisans Diploması");
                          } else if (scholarship.education_level === "yükseklisans") {
                            documents.push("Yüksek Lisans Diploması");
                          }
                          return documents.slice(0, 2);
                        };

                        const requiredDocuments = getRequiredDocuments();

                        // Favicon URL: Önce database'den, yoksa Google Favicon Service
                        const getFaviconUrl = () => {
                          // Önce organization logo_url kontrol et
                          if (scholarship.organization?.logo_url) {
                            return scholarship.organization.logo_url;
                          }
                          
                          // Eğer database'de yoksa, hiç favicon deneme, direkt initial göster
                          return null;
                        };

                        const faviconUrl = getFaviconUrl();

                        return (
                          <div key={scholarship.id} className="col-xl-6 col-lg-6 col-md-12 col-12 mb-30" style={{ display: "block" }}>
                            <div className="card-grid-2 hover-up" style={{ height: "100%", display: "flex", flexDirection: "column", visibility: "visible", opacity: 1 }}>
                              <div className="card-grid-2-image-left">
                                <div className="image-box">
                                  {faviconUrl ? (
                                    <>
                                      <img 
                                        src={faviconUrl} 
                                        alt={scholarship.organization?.name || 'Organization'}
                                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                        onError={(e) => {
                                          // Favicon yüklenemezse gradient arka plana geç
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          const fallback = target.parentElement?.querySelector('.favicon-fallback') as HTMLElement;
                                          if (fallback) {
                                            fallback.style.display = 'flex';
                                          }
                                        }}
                                      />
                                      <div 
                                        className="favicon-fallback"
                                        style={{ 
                                          width: "60px", 
                                          height: "60px", 
                                          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                          borderRadius: "12px",
                                          display: "none",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "white",
                                          fontSize: "24px",
                                          fontWeight: "bold",
                                          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                                        }}
                                      >
                                        {(scholarship.organization?.name || 'K').charAt(0)}
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ 
                                      width: "60px", 
                                      height: "60px", 
                                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                      borderRadius: "12px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      fontSize: "24px",
                                      fontWeight: "bold",
                                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                                    }}>
                                      {(scholarship.organization || 'K').charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="right-info">
                                  <span className="name-job">{scholarship.organization?.name || 'Kurum'}</span>
                                  <span className="location-small">İstanbul, TR</span>
                                </div>
                              </div>
                              <div className="card-block-info" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                <h4>
                                  <Link href={`/burs/${scholarship.id}`}>
                                    <span>{scholarship.title || 'Burs'}</span>
                                  </Link>
                                </h4>
                                <div className="mt-5">
                                  <span className="card-briefcase">{scholarship.type || 'akademik'}</span>
                                  <span className="card-time">
                                    <span>{scholarship.deadline ? formatDate(scholarship.deadline) : 'Devam ediyor'}</span>
                                  </span>
                                </div>
                                <p className="font-sm color-text-paragraph mt-10" style={{ flexGrow: 1 }}>
                                  {scholarship.description && scholarship.description.length > 120
                                    ? `${scholarship.description.substring(0, 120)}...`
                                    : (scholarship.description || 'Burs açıklaması yakında eklenecek.')}
                                </p>
                                <div className="card-2-bottom mt-20" style={{ marginTop: "auto" }}>
                                  <div className="row align-items-center">
                                    <div className="col-lg-5 col-5">
                                      <span className="card-text-price">{(scholarship.amount || 0).toLocaleString("tr-TR")} ₺</span>
                                      <span className="text-muted">/{scholarship.amount_type || 'aylık'}</span>
                                    </div>
                                    <div className="col-lg-7 col-7 text-end">
                                      <div className="d-flex gap-2 justify-content-end">
                                        <Link
                                          href={`/burs/${scholarship.id}`}
                                          className="btn btn-apply-now"
                                        >
                                          Detay
                                        </Link>
                                        <a
                                          href={scholarship.application_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-default"
                                          style={{
                                            backgroundColor: 'transparent',
                                            color: '#3b82f6',
                                            border: '2px solid #e5e7eb',
                                            fontWeight: '500'
                                          }}
                                        >
                                          Başvur
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                        {/* Önceki Butonu */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ← Önceki
                        </button>

                        {/* Sayfa Numaraları */}
                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                                  : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        {/* Sonraki Butonu */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Sonraki →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center mt-50">
                    <p className="font-lg color-text-paragraph-2">Henüz burs bulunmamaktadır.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Alt bölümleri koru */}
        <section className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Haberler ve Blog</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">En son haberler, güncellemeler ve ipuçlarını al</p>
            </div>
          </div>
          <div className="container">
            <div className="mt-50">
              <div className="box-swiper style-nav-top">
                <BlogSlider />
              </div>

              <div className="text-center">
                <Link href="/blog-grid">
                  <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Daha Fazla Gönderi Yükle</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-20">
          <div className="container">
            <div className="box-newsletter">
              <div className="row">
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                </div>
                <div className="col-lg-12 col-xl-6 col-12">
                  <h2 className="text-md-newsletter text-center">
                    Yeni Şeyler Her Zaman
                    <br /> Düzenli Olarak Güncellenir
                  </h2>
                  <div className="box-form-newsletter mt-40">
                    <form className="form-newsletter">
                      <input className="input-newsletter" type="text" placeholder="E-posta adresinizi buraya girin" />
                      <button className="btn btn-default font-heading icon-send-letter">Abone Ol</button>
                    </form>
                  </div>
                </div>
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
