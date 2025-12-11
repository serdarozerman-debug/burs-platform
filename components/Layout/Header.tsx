/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  useEffect(() => {
    // Kullanıcı session'ını kontrol et
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User profile bilgilerini al
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, email, full_name, avatar_url, role')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
              role: profile.role || null,
            });
          } else {
            // Eğer profile yoksa, session'dan bilgileri al
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
              role: null,
            });
          }
        }
      } catch (error) {
        console.error('User check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <>
      <header className={scroll ? "header sticky-bar stick" : "header sticky-bar"}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <img alt="BursBuldum" src="/assets/imgs/template/tum-burslar-logo.svg" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li>
                    <Link href="/">
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/hakkimizda">
                      <span>Hakkımızda</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-grid">
                      <span>Blog</span>
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="#contact-section" 
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('contact-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                          // Eğer ana sayfada değilsek, ana sayfaya git ve scroll yap
                          window.location.href = '/#contact-section';
                        }
                      }}
                    >
                      <span>İletişim</span>
                    </a>
                  </li>
                </ul>
              </nav>
              <div
                className={`burger-icon burger-icon-white ${openClass && "burger-close"}`}
                onClick={() => {
                  handleOpen();
                  handleRemove();
                }}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>
            <div className="header-right">
              {loading ? (
                <div className="block-signin">
                  <span className="text-link-bd-btom">Yükleniyor...</span>
                </div>
              ) : user ? (
                <div className="block-signin" style={{ position: 'relative' }}>
                  <div
                    className="d-flex align-items-center cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onMouseEnter={() => setShowUserMenu(true)}
                    style={{ cursor: 'pointer', gap: '10px' }}
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#4A90E2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px',
                        }}
                      >
                        {(user.full_name || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-link-bd-btom hover-up">
                      {user.full_name || user.email.split('@')[0]}
                    </span>
                  </div>
                  {showUserMenu && (
                    <div
                      className="user-menu-dropdown"
                      onMouseLeave={() => setShowUserMenu(false)}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '10px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        minWidth: '200px',
                        zIndex: 1000,
                        padding: '10px 0',
                      }}
                    >
                      <div style={{ padding: '10px 20px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                          {user.full_name || 'Kullanıcı'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {user.email}
                        </div>
                        {user.role === 'admin' && (
                          <div style={{ fontSize: '11px', color: '#4A90E2', marginTop: '5px', fontWeight: 'bold' }}>
                            👑 Admin
                          </div>
                        )}
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 20px',
                            textAlign: 'left',
                            textDecoration: 'none',
                            color: '#4A90E2',
                            fontSize: '14px',
                            borderBottom: '1px solid #eee',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          📊 Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '10px 20px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: '#dc3545',
                          fontSize: '14px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="block-signin">
                  <Link href="/page-register">
                    <span className="text-link-bd-btom hover-up">Kayıt Ol</span>
                  </Link>

                  <Link href="/page-signin">
                    <span className="btn btn-default btn-shadow ml-40 hover-up">Giriş Yap</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li>
                      <Link href="/" onClick={handleRemove}>
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/hakkimizda" onClick={handleRemove}>
                        <span>Hakkımızda</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog-grid" onClick={handleRemove}>
                        <span>Blog</span>
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="#contact-section" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove();
                          const element = document.getElementById('contact-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.location.href = '/#contact-section';
                          }
                        }}
                      >
                        <span>İletişim</span>
                      </a>
                    </li>
                    {user ? (
                      <>
                        <li>
                          <div className="d-flex align-items-center" style={{ padding: "10px 20px", gap: "10px" }}>
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || user.email}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#4A90E2",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {(user.full_name || user.email || "U")[0].toUpperCase()}
                              </div>
                            )}
                            <span>{user.full_name || user.email.split("@")[0]}</span>
                          </div>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                              handleRemove();
                            }}
                          >
                            <span>Çıkış Yap</span>
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href="/page-register" onClick={handleRemove}>
                            <span>Kayıt Ol</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-signin" onClick={handleRemove}>
                            <span>Giriş Yap</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Hesabınız</h6>
                <ul className="mobile-menu font-heading">
                  {user ? (
                    <>
                      <li>
                        <div style={{ padding: "10px 20px" }}>
                          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                            {user.full_name || "Kullanıcı"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {user.email}
                          </div>
                        </div>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                            handleRemove();
                          }}
                        >
                          <span>Çıkış Yap</span>
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/page-signin" onClick={handleRemove}>
                          <span>Giriş Yap</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-register" onClick={handleRemove}>
                          <span>Kayıt Ol</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2024 © BursBuldum. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li>
                      <Link href="/" onClick={handleRemove}>
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/hakkimizda" onClick={handleRemove}>
                        <span>Hakkımızda</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog-grid" onClick={handleRemove}>
                        <span>Blog</span>
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="#contact-section" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove();
                          const element = document.getElementById('contact-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.location.href = '/#contact-section';
                          }
                        }}
                      >
                        <span>İletişim</span>
                      </a>
                    </li>
                    {user ? (
                      <>
                        <li>
                          <div className="d-flex align-items-center" style={{ padding: "10px 20px", gap: "10px" }}>
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || user.email}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#4A90E2",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {(user.full_name || user.email || "U")[0].toUpperCase()}
                              </div>
                            )}
                            <span>{user.full_name || user.email.split("@")[0]}</span>
                          </div>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                              handleRemove();
                            }}
                          >
                            <span>Çıkış Yap</span>
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href="/page-register" onClick={handleRemove}>
                            <span>Kayıt Ol</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-signin" onClick={handleRemove}>
                            <span>Giriş Yap</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Hesabınız</h6>
                <ul className="mobile-menu font-heading">
                  {user ? (
                    <>
                      <li>
                        <div style={{ padding: "10px 20px" }}>
                          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                            {user.full_name || "Kullanıcı"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {user.email}
                          </div>
                        </div>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                            handleRemove();
                          }}
                        >
                          <span>Çıkış Yap</span>
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/page-signin" onClick={handleRemove}>
                          <span>Giriş Yap</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-register" onClick={handleRemove}>
                          <span>Kayıt Ol</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2024 © BursBuldum. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
