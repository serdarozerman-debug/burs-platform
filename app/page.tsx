/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout/Layout";
import CategorySlider from "@/components/sliders/Category";
import TopRekruterSlider from "@/components/sliders/TopRekruter";
import BlogSlider from "@/components/sliders/Blog";
import CategoryTab from "@/components/elements/CategoryTab";
import Link from "next/link";
import { Scholarship, supabase } from "@/lib/supabase";
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
  const [sortBy, setSortBy] = useState<string>("created_desc"); // Sıralama state'i
  const [homepageContent, setHomepageContent] = useState<{
    hero_title?: string;
    hero_subtitle?: string;
    hero_description?: string;
  }>({});

  // Fetch scholarships with pagination
  const fetchScholarships = useCallback(async (page: number = 1) => {
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
      
      // Sıralama parametresi ekle
      queryParams.append("sort", sortBy);

      const url = `/api/scholarships?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch scholarships");
      }
      const result = await response.json();
      
      setScholarships(result.data || []);
      setTotalCount(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  // Fetch homepage content
  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('key, title, content');
        
        if (error) {
          console.error('Homepage content fetch error:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const contentMap: any = {};
          data.forEach((item: any) => {
            if (item.key === 'hero_title') {
              // hero_title için sadece content kullan (title label değil, içerik)
              contentMap.hero_title = item.content || '';
            } else if (item.key === 'hero_subtitle') {
              // hero_subtitle için sadece content kullan
              contentMap.hero_subtitle = item.content || '';
            } else if (item.key === 'hero_description') {
              // hero_description için content kullan
              contentMap.hero_description = item.content || '';
            }
          });
          setHomepageContent(contentMap);
        }
      } catch (err) {
        console.error('Homepage content fetch error:', err);
      }
    };
    fetchHomepageContent();
    
    // Her 5 saniyede bir yeniden yükle (güncellemeleri yakalamak için)
    const interval = setInterval(fetchHomepageContent, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchScholarships(1);
  }, []);

  // Fetch when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchScholarships(1);
    }, filters.search ? 500 : 0); // Search için debounce, diğerleri için anında

    return () => clearTimeout(timer);
  }, [filters, fetchScholarships]);

  // Fetch when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchScholarships(currentPage);
    }
  }, [currentPage, fetchScholarships]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatEducationLevel = (level: string) => {
    if (level === 'yükseklisans') return 'Yüksek Lisans';
    return capitalize(level);
  };

  const formatAmountType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'aylık': 'Aylık',
      'yıllık': 'Yıllık',
      'tek seferlik': 'Tek Seferlik'
    };
    return typeMap[type] || capitalize(type);
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
        
        {/* Hero Section */}
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center mb-50">
              <h1 className="heading-banner hero-title-split wow animate__animated animate__fadeInUp" style={{ fontSize: "48px", fontWeight: "700" }}>
                {homepageContent.hero_title ? (
                  (() => {
                    // Metni kelimelere böl - ilk iki kelime açık mavi, geri kalanı koyu renk
                    const words = homepageContent.hero_title.split(' ');
                    if (words.length >= 2) {
                      const firstTwoWords = words.slice(0, 2).join(' ');
                      const restWords = words.slice(2).join(' ');
                      
                      return (
                        <>
                          <span className="first-part" style={{ color: "#4A90E2" }}>{firstTwoWords}</span>
                          {restWords && (
                            <>
                              {' '}
                              <span className="second-part" style={{ color: "#1a1a1a" }}>{restWords}</span>
                            </>
                          )}
                        </>
                      );
                    } else {
                      // Eğer 2'den az kelime varsa, ilk kelimeyi açık mavi yap
                      return (
                        <span className="first-part" style={{ color: "#4A90E2" }}>{homepageContent.hero_title}</span>
                      );
                    }
                  })()
                ) : (
                  <>Sana Uygun <span className="color-brand-2">Bursları Bul!</span></>
                )}
              </h1>
              {homepageContent.hero_subtitle && (
                <h2 className="heading-banner-subtitle mt-20 wow animate__animated animate__fadeInUp" data-wow-delay=".05s" style={{ fontSize: "32px", fontWeight: "600", color: "#4A90E2" }}>
                  {homepageContent.hero_subtitle}
                </h2>
              )}
              <div className="banner-description mt-20 wow animate__animated animate__fadeInUp" data-wow-delay=".1s" style={{ maxWidth: "800px", margin: "20px auto", fontSize: "18px", lineHeight: "1.6" }}>
                {homepageContent.hero_description || "Yurtiçi ve yurtdışındaki üniversite burslarına ve diğer tüm burslara kolayca ulaş! Burs başvuruları, yüksek lisans bursları, karşılıksız ve geri ödemesiz burs başvuruları ne zaman yapılıyor öğren ve hemen sana uygun burslara başvur."}
              </div>
            </div>
          </div>
        </section>

        {/* Diğer bölümleri kaldır, sadece burs listesine devam et */}
        <section id="scholarships-section" className="section-box mt-50">
          <div className="container">
            
            <div className="row">
              <div className="col-lg-3 col-md-12 mb-30">
                <ScholarshipFilters
                  onFilterChange={setFilters}
                  currentFilters={filters}
                />
              </div>
              <div className="col-lg-9 col-md-12" style={{ minHeight: "auto" }}>
                {/* Sıralama Barı */}
                <div className="d-flex justify-content-between align-items-center mb-30" style={{ 
                  background: "#fff", 
                  padding: "20px", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <div>
                    <h5 className="mb-0" style={{ fontSize: "18px", fontWeight: "600" }}>
                      {totalCount} Burs Bulundu
                    </h5>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <label htmlFor="sort-select" style={{ fontSize: "14px", fontWeight: "500", marginRight: "10px", marginBottom: "0" }}>
                      Sırala:
                    </label>
                    <select
                      id="sort-select"
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        width: "auto",
                        padding: "8px 16px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer"
                      }}
                    >
                      <option value="created_desc">🆕 En Yeni Burslar</option>
                      <option value="deadline_asc">⏰ Son Başvuru Yakın</option>
                      <option value="amount_desc">💰 Burs Miktarı (Yüksek → Düşük)</option>
                      <option value="amount_asc">💰 Burs Miktarı (Düşük → Yüksek)</option>
                    </select>
                  </div>
                </div>

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
                                  <span className="card-briefcase">{capitalize(scholarship.type || 'akademik')}</span>
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
                                      <span className="card-text-price">{(scholarship.amount || 0).toLocaleString("tr-TR")}₺</span>
                                      <span className="text-muted">/{formatAmountType(scholarship.amount_type || 'aylık')}</span>
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
                    {/* Pagination - Her zaman göster (totalCount > ITEMS_PER_PAGE ise) */}
                    {totalCount > ITEMS_PER_PAGE && (
                      <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                        {/* Önceki Butonu */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ← Önceki
                        </button>

                        {/* Sayfa Numaraları - Max 10 sayfa göster */}
                        <div className="flex gap-2">
                          {/* İlk sayfa */}
                          {currentPage > 3 && (
                            <>
                              <button
                                onClick={() => setCurrentPage(1)}
                                className="w-12 h-12 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                1
                              </button>
                              {currentPage > 4 && <span className="px-2 py-3">...</span>}
                            </>
                          )}

                          {/* Mevcut sayfa civarı (max 5 sayfa) */}
                          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                            const pageNum = i + 1;
                            // Sadece mevcut sayfaya yakın olanları göster
                            if (totalPages <= 10) {
                              return pageNum;
                            } else if (pageNum >= currentPage - 2 && pageNum <= currentPage + 2) {
                              return pageNum;
                            }
                            return null;
                          }).filter(Boolean).map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum!)}
                              className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                                  : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          {/* Son sayfa */}
                          {totalPages > 10 && currentPage < totalPages - 2 && (
                            <>
                              {currentPage < totalPages - 3 && <span className="px-2 py-3">...</span>}
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-12 h-12 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}

                          {/* 10+ sayfa uyarısı */}
                          {totalPages > 10 && currentPage >= totalPages - 2 && (
                            <div className="ml-3 text-sm text-gray-600">
                              Sayfa {totalPages} / {totalPages > 10 ? '10+ (max)' : totalPages}
                            </div>
                          )}
                        </div>

                        {/* Sonraki Butonu */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(Math.min(totalPages, 10), prev + 1))}
                          disabled={currentPage === totalPages || currentPage === 10}
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Sonraki →
                        </button>
                      </div>
                    )}

                    {/* Load More Button (10. sayfadan sonra) */}
                    {currentPage === 10 && totalPages > 10 && (
                      <div className="text-center mt-8 mb-8">
                        <div className="alert alert-info inline-block">
                          <p className="mb-3">
                            <strong>ℹ️ Daha fazla burs var!</strong>
                            <br />
                            Daha spesifik arama yapın veya filtreleri kullanın.
                          </p>
                          <div className="btn-group">
                            <button
                              onClick={() => {
                                setFilters({ ...filters, search: "" });
                                setCurrentPage(1);
                              }}
                              className="btn btn-outline-primary"
                            >
                              🔍 Filtreleri Kullan
                            </button>
                          </div>
                        </div>
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
