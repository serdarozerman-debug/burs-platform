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
  const ITEMS_PER_PAGE = 10;
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: [],
    education_level: [],
    min_amount: 0,
    max_amount: 25000,
    days_left: null,
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
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
        if (filters.min_amount > 0) {
          queryParams.append("min_amount", filters.min_amount.toString());
        }
        if (filters.max_amount < 25000) {
          queryParams.append("max_amount", filters.max_amount.toString());
        }
        if (filters.days_left !== null) {
          queryParams.append("days_left", filters.days_left.toString());
        }

        const url = queryParams.toString() ? `/api/scholarships?${queryParams.toString()}` : "/api/scholarships";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch scholarships");
        const data = await response.json();
        
        // Test amaçlı: Gelen veriyi duplicate edip 45'e tamamla
        let testData = [...data];
        while (testData.length < 45 && data.length > 0) {
          const duplicates = data.map((scholarship: Scholarship, index: number) => ({
            ...scholarship,
            id: `${scholarship.id}-duplicate-${Math.floor(testData.length / data.length)}-${index}`,
            title: `${scholarship.title} (Test ${Math.floor(testData.length / data.length) + 1})`,
          }));
          testData = [...testData, ...duplicates];
        }
        testData = testData.slice(0, 45); // Tam 45 burs
        
        setScholarships(testData);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [filters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentScholarships = scholarships.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(scholarships.length / ITEMS_PER_PAGE);

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
        <section className="section-box">
          <div className="banner-hero hero-1">
            <div className="banner-inner">
              <div className="row">
                <div className="col-xl-8 col-lg-12">
                  <div className="block-banner">
                    <h1 className="heading-banner wow animate__animated animate__fadeInUp">
                      Yeni Bursunuzu Bulmanın <span className="color-brand-2">En Kolay Yolu</span>
                    </h1>
                    <div className="banner-description mt-20 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                      Her ay binlerce öğrenci burs arayışında. <br className="d-none d-lg-block" />
                      Sen de hayallerindeki bursu bul!
                    </div>
                    <div className="form-find mt-40 wow animate__animated animate__fadeIn" data-wow-delay=".2s">
                      <form>
                        <div className="box-industry">
                          <select className="form-input mr-10 select-active input-industry">
                            <option value={0}>Kategori</option>
                            <option value={1}>Software</option>
                            <option value={2}>Finance</option>
                            <option value={3}>Recruting</option>
                            <option value={4}>Management</option>
                            <option value={5}>Advertising</option>
                            <option value={6}>Development</option>
                          </select>
                        </div>
                        <div className="box-industry">
                          <select className="form-input mr-10 select-active  input-location">
                            <option value="">Konum</option>
                            <option value="AX">Aland Islands</option>
                            <option value="AF">Afghanistan</option>
                            <option value="AL">Albania</option>
                            <option value="DZ">Algeria</option>
                            <option value="AD">Andorra</option>
                            <option value="AO">Angola</option>
                            <option value="AI">Anguilla</option>
                            <option value="AQ">Antarctica</option>
                            <option value="AG">Antigua and Barbuda</option>
                            <option value="AR">Argentina</option>
                            <option value="AM">Armenia</option>
                            <option value="AW">Aruba</option>
                            <option value="AU">Australia</option>
                            <option value="AT">Austria</option>
                            <option value="AZ">Azerbaijan</option>
                            <option value="BS">Bahamas</option>
                            <option value="BH">Bahrain</option>
                            <option value="BD">Bangladesh</option>
                            <option value="BB">Barbados</option>
                            <option value="BY">Belarus</option>
                            <option value="PW">Belau</option>
                            <option value="BE">Belgium</option>
                            <option value="BZ">Belize</option>
                            <option value="BJ">Benin</option>
                            <option value="BM">Bermuda</option>
                            <option value="BT">Bhutan</option>
                            <option value="BO">Bolivia</option>
                            <option value="BQ">Bonaire, Saint Eustatius and Saba</option>
                            <option value="BA">Bosnia and Herzegovina</option>
                            <option value="BW">Botswana</option>
                            <option value="BV">Bouvet Island</option>
                            <option value="BR">Brazil</option>
                            <option value="IO">British Indian Ocean Territory</option>
                            <option value="VG">British Virgin Islands</option>
                            <option value="BN">Brunei</option>
                            <option value="BG">Bulgaria</option>
                            <option value="BF">Burkina Faso</option>
                            <option value="BI">Burundi</option>
                            <option value="KH">Cambodia</option>
                            <option value="CM">Cameroon</option>
                            <option value="CA">Canada</option>
                            <option value="CV">Cape Verde</option>
                            <option value="KY">Cayman Islands</option>
                            <option value="CF">Central African Republic</option>
                            <option value="TD">Chad</option>
                            <option value="CL">Chile</option>
                            <option value="CN">China</option>
                            <option value="CX">Christmas Island</option>
                            <option value="CC">Cocos (Keeling) Islands</option>
                            <option value="CO">Colombia</option>
                            <option value="KM">Comoros</option>
                            <option value="CG">Congo (Brazzaville)</option>
                            <option value="CD">Congo (Kinshasa)</option>
                            <option value="CK">Cook Islands</option>
                            <option value="CR">Costa Rica</option>
                            <option value="HR">Croatia</option>
                            <option value="CU">Cuba</option>
                            <option value="CW">CuraÇao</option>
                            <option value="CY">Cyprus</option>
                            <option value="CZ">Czech Republic</option>
                            <option value="DK">Denmark</option>
                            <option value="DJ">Djibouti</option>
                            <option value="DM">Dominica</option>
                            <option value="DO">Dominican Republic</option>
                            <option value="EC">Ecuador</option>
                            <option value="EG">Egypt</option>
                            <option value="SV">El Salvador</option>
                            <option value="GQ">Equatorial Guinea</option>
                            <option value="ER">Eritrea</option>
                            <option value="EE">Estonia</option>
                            <option value="ET">Ethiopia</option>
                            <option value="FK">Falkland Islands</option>
                            <option value="FO">Faroe Islands</option>
                            <option value="FJ">Fiji</option>
                            <option value="FI">Finland</option>
                            <option value="FR">France</option>
                            <option value="GF">French Guiana</option>
                            <option value="PF">French Polynesia</option>
                            <option value="TF">French Southern Territories</option>
                            <option value="GA">Gabon</option>
                            <option value="GM">Gambia</option>
                            <option value="GE">Georgia</option>
                            <option value="DE">Germany</option>
                            <option value="GH">Ghana</option>
                            <option value="GI">Gibraltar</option>
                            <option value="GR">Greece</option>
                            <option value="GL">Greenland</option>
                            <option value="GD">Grenada</option>
                            <option value="GP">Guadeloupe</option>
                            <option value="GT">Guatemala</option>
                            <option value="GG">Guernsey</option>
                            <option value="GN">Guinea</option>
                            <option value="GW">Guinea-Bissau</option>
                            <option value="GY">Guyana</option>
                            <option value="HT">Haiti</option>
                            <option value="HM">Heard Island and McDonald Islands</option>
                            <option value="HN">Honduras</option>
                            <option value="HK">Hong Kong</option>
                            <option value="HU">Hungary</option>
                            <option value="IS">Iceland</option>
                            <option value="IN">India</option>
                            <option value="ID">Indonesia</option>
                            <option value="IR">Iran</option>
                            <option value="IQ">Iraq</option>
                            <option value="IM">Isle of Man</option>
                            <option value="IL">Israel</option>
                            <option value="IT">Italy</option>
                            <option value="CI">Ivory Coast</option>
                            <option value="JM">Jamaica</option>
                            <option value="JP">Japan</option>
                            <option value="JE">Jersey</option>
                            <option value="JO">Jordan</option>
                            <option value="KZ">Kazakhstan</option>
                            <option value="KE">Kenya</option>
                            <option value="KI">Kiribati</option>
                            <option value="KW">Kuwait</option>
                            <option value="KG">Kyrgyzstan</option>
                            <option value="LA">Laos</option>
                            <option value="LV">Latvia</option>
                            <option value="LB">Lebanon</option>
                            <option value="LS">Lesotho</option>
                            <option value="LR">Liberia</option>
                            <option value="LY">Libya</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="LT">Lithuania</option>
                            <option value="LU">Luxembourg</option>
                            <option value="MO">Macao S.A.R., China</option>
                            <option value="MK">Macedonia</option>
                            <option value="MG">Madagascar</option>
                            <option value="MW">Malawi</option>
                            <option value="MY">Malaysia</option>
                            <option value="MV">Maldives</option>
                            <option value="ML">Mali</option>
                            <option value="MT">Malta</option>
                            <option value="MH">Marshall Islands</option>
                            <option value="MQ">Martinique</option>
                            <option value="MR">Mauritania</option>
                            <option value="MU">Mauritius</option>
                            <option value="YT">Mayotte</option>
                            <option value="MX">Mexico</option>
                            <option value="FM">Micronesia</option>
                            <option value="MD">Moldova</option>
                            <option value="MC">Monaco</option>
                            <option value="MN">Mongolia</option>
                            <option value="ME">Montenegro</option>
                            <option value="MS">Montserrat</option>
                            <option value="MA">Morocco</option>
                            <option value="MZ">Mozambique</option>
                            <option value="MM">Myanmar</option>
                            <option value="NA">Namibia</option>
                            <option value="NR">Nauru</option>
                            <option value="NP">Nepal</option>
                            <option value="NL">Netherlands</option>
                            <option value="AN">Netherlands Antilles</option>
                            <option value="NC">New Caledonia</option>
                            <option value="NZ">New Zealand</option>
                            <option value="NI">Nicaragua</option>
                            <option value="NE">Niger</option>
                            <option value="NG">Nigeria</option>
                            <option value="NU">Niue</option>
                            <option value="NF">Norfolk Island</option>
                            <option value="KP">North Korea</option>
                            <option value="NO">Norway</option>
                            <option value="OM">Oman</option>
                            <option value="PK">Pakistan</option>
                            <option value="PS">Palestinian Territory</option>
                            <option value="PA">Panama</option>
                            <option value="PG">Papua New Guinea</option>
                            <option value="PY">Paraguay</option>
                            <option value="PE">Peru</option>
                            <option value="PH">Philippines</option>
                            <option value="PN">Pitcairn</option>
                            <option value="PL">Poland</option>
                            <option value="PT">Portugal</option>
                            <option value="QA">Qatar</option>
                            <option value="IE">Republic of Ireland</option>
                            <option value="RE">Reunion</option>
                            <option value="RO">Romania</option>
                            <option value="RU">Russia</option>
                            <option value="RW">Rwanda</option>
                            <option value="ST">São Tomé and Príncipe</option>
                            <option value="BL">Saint Barthélemy</option>
                            <option value="SH">Saint Helena</option>
                            <option value="KN">Saint Kitts and Nevis</option>
                            <option value="LC">Saint Lucia</option>
                            <option value="SX">Saint Martin (Dutch part)</option>
                            <option value="MF">Saint Martin (French part)</option>
                            <option value="PM">Saint Pierre and Miquelon</option>
                            <option value="VC">Saint Vincent and the Grenadines</option>
                            <option value="SM">San Marino</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="SN">Senegal</option>
                            <option value="RS">Serbia</option>
                            <option value="SC">Seychelles</option>
                            <option value="SL">Sierra Leone</option>
                            <option value="SG">Singapore</option>
                            <option value="SK">Slovakia</option>
                            <option value="SI">Slovenia</option>
                            <option value="SB">Solomon Islands</option>
                            <option value="SO">Somalia</option>
                            <option value="ZA">South Africa</option>
                            <option value="GS">South Georgia/Sandwich Islands</option>
                            <option value="KR">South Korea</option>
                            <option value="SS">South Sudan</option>
                            <option value="ES">Spain</option>
                            <option value="LK">Sri Lanka</option>
                            <option value="SD">Sudan</option>
                            <option value="SR">Suriname</option>
                            <option value="SJ">Svalbard and Jan Mayen</option>
                            <option value="SZ">Swaziland</option>
                            <option value="SE">Sweden</option>
                            <option value="CH">Switzerland</option>
                            <option value="SY">Syria</option>
                            <option value="TW">Taiwan</option>
                            <option value="TJ">Tajikistan</option>
                            <option value="TZ">Tanzania</option>
                            <option value="TH">Thailand</option>
                            <option value="TL">Timor-Leste</option>
                            <option value="TG">Togo</option>
                            <option value="TK">Tokelau</option>
                            <option value="TO">Tonga</option>
                            <option value="TT">Trinidad and Tobago</option>
                            <option value="TN">Tunisia</option>
                            <option value="TR">Turkey</option>
                            <option value="TM">Turkmenistan</option>
                            <option value="TC">Turks and Caicos Islands</option>
                            <option value="TV">Tuvalu</option>
                            <option value="UG">Uganda</option>
                            <option value="UA">Ukraine</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="GB">United Kingdom (UK)</option>
                            <option value="US">USA (US)</option>
                            <option value="UY">Uruguay</option>
                            <option value="UZ">Uzbekistan</option>
                            <option value="VU">Vanuatu</option>
                            <option value="VA">Vatican</option>
                            <option value="VE">Venezuela</option>
                            <option value="VN">Vietnam</option>
                            <option value="WF">Wallis and Futuna</option>
                            <option value="EH">Western Sahara</option>
                            <option value="WS">Western Samoa</option>
                            <option value="YE">Yemen</option>
                            <option value="ZM">Zambia</option>
                            <option value="ZW">Zimbabwe</option>
                          </select>
                        </div>
                        <input className="form-input input-keysearch mr-10" type="text" placeholder="Arama yapın... " />
                        <button className="btn btn-default btn-find font-sm">Ara</button>
                      </form>
                    </div>
                    <div className="list-tags-banner mt-60 wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
                      <strong>Popüler Aramalar:</strong>
                      <Link href="#">Designer,</Link>
                      <Link href="#">Web,</Link>
                      <Link href="#">IOS,</Link>
                      <Link href="#">Developer,</Link>
                      <Link href="#">PHP,</Link>
                      <Link href="#">Senior,</Link>
                      <Link href="#">Engineer,</Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-12 d-none d-xl-block col-md-6">
                  <div className="banner-imgs">
                    <div className="block-1 shape-1">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/banner1.png" />
                    </div>
                    <div className="block-2 shape-2">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/banner2.png" />
                    </div>
                    <div className="block-3 shape-3">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/icon-top-banner.png" />
                    </div>
                    <div className="block-4 shape-3">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/icon-bottom-banner.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-100" />
        <section className="section-box mt-80">
          <div className="section-box wow animate__animated animate__fadeIn">
            <div className="container">
              <div className="text-center">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Kategoriye Göre İncele</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Sana uygun bursu bul. Her gün 800+ yeni burs fırsatı</p>
              </div>
              <div className="box-swiper mt-50">
                <CategorySlider />
              </div>
            </div>
          </div>
        </section>
        <div className="section-box mb-30">
          <div className="container">
            <div className="box-we-hiring">
              <div className="text-1">
                <span className="text-we-are">Biz</span>
                <span className="text-hiring">İşe Alıyoruz</span>
              </div>
              <div className="text-2">
                Birlikte <span className="color-brand-1">Çalışalım</span>
                <br /> &amp; <span className="color-brand-1">Fırsatları</span> Keşfedelim
              </div>
              <div className="text-3">
                <div className="btn btn-apply btn-apply-icon" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                  Şimdi Başvur
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 id="scholarships-section" className="section-title mb-10 wow animate__animated animate__fadeInUp">Popüler Burslar</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">En çok aranan burs fırsatlarını keşfet</p>
            </div>
            <div className="flex gap-8 mt-50">
              <div className="w-1/4">
                <ScholarshipFilters
                  onFilterChange={setFilters}
                  currentFilters={filters}
                />
              </div>
              <div className="w-3/4">
                {loading ? (
                  <div className="text-center mt-50">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p className="mt-20">Burslar yükleniyor...</p>
                  </div>
                ) : scholarships.length > 0 ? (
                  <>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="space-y-8">
                        {currentScholarships.map((scholarship, index) => {
                        // Evrak gruplaması (örnek: kimlik ve nüfus cüzdanı aynı grup)
                        const getRequiredDocuments = () => {
                          const documents: string[] = [];
                          // Type'a göre evrak ekle
                          if (scholarship.type === "akademik") {
                            documents.push("Transkript", "Not Belgesi");
                          } else if (scholarship.type === "engelli") {
                            documents.push("Engelli Raporu", "Sağlık Raporu");
                          } else if (scholarship.type === "ihtiyaç") {
                            documents.push("Gelir Belgesi", "Aile Durum Belgesi");
                          }
                          // Education level'a göre ekle
                          if (scholarship.education_level === "lise") {
                            documents.push("Lise Diploması");
                          } else if (scholarship.education_level === "lisans") {
                            documents.push("Lisans Diploması");
                          } else if (scholarship.education_level === "yükseklisans") {
                            documents.push("Yüksek Lisans Diploması");
                          }
                          // İlk 2-3 önemli evrakı döndür
                          return documents.slice(0, 2);
                        };

                        // Kriterler (en önemlileri)
                        const getCriteria = () => {
                          const criteria: string[] = [];
                          if (scholarship.type === "akademik") {
                            criteria.push("Akademik Başarı");
                          } else if (scholarship.type === "engelli") {
                            criteria.push("Engelli");
                          } else if (scholarship.type === "ihtiyaç") {
                            criteria.push("Maddi İhtiyaç");
                          }
                          return criteria;
                        };

                        const requiredDocuments = getRequiredDocuments();
                        const criteria = getCriteria();
                        const isFirst = index === 0;
                        const isLast = index === scholarships.length - 1;

                        return (
                          <div
                            key={scholarship.id}
                            className={`bg-white/50 shadow-none hover:bg-gray-100 transition-all duration-300 border-b border-gray-200 py-12 px-10 last:border-b-0 overflow-hidden ${
                              isFirst ? "rounded-t-xl" : ""
                            } ${isLast ? "rounded-b-xl" : ""} ${
                              !isFirst && !isLast ? "rounded-none" : ""
                            }`}
                          >
                          {/* Top Section: Logo, Company, Location, Documents */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              {/* Logo */}
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm flex items-center justify-center flex-shrink-0">
                                {scholarship.organization_logo ? (
                                  <img
                                    src={scholarship.organization_logo}
                                    alt={scholarship.organization}
                                    className="w-10 h-10 object-contain"
                                  />
                                ) : (
                                  <span className="text-xl font-bold text-white">
                                    {scholarship.organization.charAt(0)}
                                  </span>
                                )}
                              </div>
                              {/* Company Name and Location */}
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                  {scholarship.organization}
                                </h4>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>İstanbul, TR</span>
                                </div>
                              </div>
                            </div>
                            {/* Required Documents (Top Right) */}
                            <div className="flex gap-2 flex-wrap justify-end">
                              {requiredDocuments.map((doc, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-normal"
                                >
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Scholarship Title */}
                          <h3 className="text-2xl font-bold text-blue-600 mb-3">
                            {scholarship.title}
                          </h3>

                          {/* Criteria and Deadline */}
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            {criteria.length > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{criteria[0]}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatDate(scholarship.deadline)}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {scholarship.description.length > 120
                              ? `${scholarship.description.substring(0, 120)}...`
                              : scholarship.description}
                          </p>

                          {/* Bottom Section: Amount and Apply Button */}
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-blue-600">
                              {scholarship.amount.toLocaleString("tr-TR")} ₺ / {scholarship.amount_type}
                            </div>
                            <a
                              href={scholarship.application_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                            >
                              Başvur
                            </a>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </div>

                    {/* Debug Info - Geçici */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Toplam burs: {scholarships.length} | Toplam sayfa: {totalPages} | Aktif sayfa: {currentPage}
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
        <section className="section-box overflow-visible mt-100 mb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="box-image-job">
                  <img className="img-job-1" alt="jobBox" src="assets/imgs/page/homepage1/img-chart.png" />
                  <img className="img-job-2" alt="jobBox" src="assets/imgs/page/homepage1/controlcard.png" />
                  <figure className="wow animate__animated animate__fadeIn">
                    <img alt="jobBox" src="assets/imgs/page/homepage1/img1.png" />
                  </figure>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="content-job-inner">
                  <span className="color-text-mutted text-32">Milyonlarca Burs Fırsatı. </span>
                  <h2 className="text-52 wow animate__animated animate__fadeInUp">
                    Sana <span className="color-brand-2">Uygun</span> Olanı Bul
                  </h2>
                  <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">Web'deki tüm açık pozisyonları ara. Kendi kişiselleştirilmiş burs miktarı tahminini al. Dünya çapında 600.000'den fazla kurum hakkında yorumları oku. Doğru burs seni bekliyor.</div>
                  <div className="mt-40">
                    <div className="wow animate__animated animate__fadeInUp">
                      <Link href="/jobs-grid">
                        <span className="btn btn-default">Bursları İncele</span>
                      </Link>

                      <Link href="/page-about">
                        <span className="btn btn-link">Daha Fazla Bilgi</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box overflow-visible mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">25</span>
                    <span> K+</span>
                  </h1>
                  <h5>Tamamlanan Projeler</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    Her zaman insanlara <br className="d-none d-lg-block" />
                    odaklanmış, eksiksiz çözümler
                    <br className="d-none d-lg-block" /> sunuyoruz
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">17</span>
                    <span> +</span>
                  </h1>
                  <h5>Ofislerimiz</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    Her zaman insanlara <br className="d-none d-lg-block" />
                    odaklanmış, eksiksiz çözümler <br className="d-none d-lg-block" />
                    sunuyoruz
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">86</span>
                    <span> +</span>
                  </h1>
                  <h5>Uzman İnsanlar</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    Her zaman insanlara <br className="d-none d-lg-block" />
                    odaklanmış, eksiksiz çözümler <br className="d-none d-lg-block" />
                    sunuyoruz
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">28</span>
                    <span> +</span>
                  </h1>
                  <h5>Mutlu Müşteriler</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    Her zaman insanlara <br className="d-none d-lg-block" />
                    odaklanmış, eksiksiz çözümler <br className="d-none d-lg-block" />
                    sunuyoruz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Önde Gelen Kurumlar</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Bir sonraki kariyer adımını, serbest çalışma fırsatını veya stajını keşfet</p>
            </div>
          </div>
          <div className="container">
            <div className="box-swiper mt-50">
              <TopRekruterSlider />
            </div>
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Konuma Göre Burslar</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Favori burslarını bul ve kendi avantajlarını elde et</p>
            </div>
          </div>
          <div className="container">
            <div className="row mt-50">
              <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location1.png)" }}>
                      <span className="lbl-hot">Popüler</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Paris, France</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">5 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">120 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location2.png)" }}>
                      <span className="lbl-hot">Trend</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>London, England</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">7 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">68 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location3.png)" }}>
                      <span className="lbl-hot">Popüler</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>New York, USA</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">9 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">80 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location4.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Amsterdam, Holland</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">16 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">86 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location5.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Copenhagen, Denmark</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">39 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">186 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location6.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Berlin, Germany</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">15 Boş Pozisyon</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">632 kurumlar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
