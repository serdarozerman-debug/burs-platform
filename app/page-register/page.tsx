"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    rePassword: "",
    agreeTerms: false,
  });

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google ile kayıt olurken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (formData.password !== formData.rePassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("Lütfen şartları kabul edin");
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname,
            username: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              full_name: formData.fullname,
              role: "student",
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Continue anyway, profile might already exist
        }

        // Send welcome email
        try {
          await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              fullName: formData.fullname,
            }),
          });
        } catch (emailError) {
          console.error('Welcome email error:', emailError);
          // Continue anyway, Supabase already sends confirmation email
        }

        // Show success popup
        setShowSuccess(true);

        // Email doğrulama gerekiyor - kullanıcıya bilgi ver
        // Email doğrulama linkine tıkladığında /auth/callback sayfası açılacak ve otomatik login olacak
        setTimeout(() => {
          setShowSuccess(false);
          setError(null);
          // Kullanıcıya email doğrulama mesajı göster
          alert("Kayıt başarılı! Lütfen e-postanızı kontrol edin ve doğrulama linkine tıklayın. Email doğrulandıktan sonra otomatik olarak giriş yapacaksınız.");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Kayıt olurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <section className="pt-100 login-register">
          <div className="container">
            <div className="row login-register-cover">
              <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div className="text-center">
                  <p className="font-sm text-brand-2">Kayıt Ol</p>
                  <h2 className="mt-10 mb-5 text-brand-1">Ücretsiz Başlayın</h2>
                  <p className="font-sm text-muted mb-30">Tüm özelliklere erişim. Kredi kartı gerekmez.</p>
                  <button
                    className="btn social-login hover-up mb-20"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    <img src="assets/imgs/template/icons/icon-google.svg" alt="BursBuldum" />
                    <strong>Google ile Kayıt Ol</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Veya devam edin</span>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-20" role="alert">
                    {error}
                  </div>
                )}

                {showSuccess && (
                  <div 
                    className="alert alert-success mt-20" 
                    role="alert" 
                    style={{ 
                      padding: "20px", 
                      borderRadius: "8px", 
                      backgroundColor: "#d4edda", 
                      color: "#155724", 
                      border: "2px solid #c3e6cb",
                      position: "relative",
                      animation: "fadeIn 0.3s ease-in"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "50%", 
                        backgroundColor: "#28a745", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold"
                      }}>
                        ✓
                      </div>
                      <div>
                        <strong style={{ fontSize: "18px" }}>Kayıt Başarılı!</strong>
                      </div>
                    </div>
                    <div style={{ marginLeft: "50px", lineHeight: "1.6" }}>
                      <p style={{ margin: "5px 0" }}>
                        🎉 Hoş geldiniz! Hesabınız başarıyla oluşturuldu.
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        📧 Lütfen e-postanızı kontrol edin ve doğrulama linkine tıklayın.
                      </p>
                      <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                        Email doğrulandıktan sonra otomatik olarak giriş yapacaksınız.
                      </p>
                    </div>
                  </div>
                )}

                <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-1">
                      Ad Soyad *
                    </label>
                    <input
                      className="form-control"
                      id="input-1"
                      type="text"
                      required
                      name="fullname"
                      placeholder="Adınız Soyadınız"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-2">
                      E-posta *
                    </label>
                    <input
                      className="form-control"
                      id="input-2"
                      type="email"
                      required
                      name="emailaddress"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-3">
                      Kullanıcı Adı *
                    </label>
                    <input
                      className="form-control"
                      id="input-3"
                      type="text"
                      required
                      name="username"
                      placeholder="kullaniciadi"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-4">
                      Şifre *
                    </label>
                    <input
                      className="form-control"
                      id="input-4"
                      type="password"
                      required
                      name="password"
                      placeholder="************"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-5">
                      Şifre Tekrar *
                    </label>
                    <input
                      className="form-control"
                      id="input-5"
                      type="password"
                      required
                      name="re-password"
                      placeholder="************"
                      value={formData.rePassword}
                      onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="login_footer form-group d-flex justify-content-between">
                    <label className="cb-container">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        disabled={loading}
                      />
                      <span className="text-small">Şartları kabul ediyorum</span>
                      <span className="checkmark" />
                    </label>
                    <Link href="/page-contact">
                      <span className="text-muted">Daha fazla bilgi</span>
                    </Link>
                  </div>
                  <div className="form-group">
                    <button
                      className="btn btn-brand-1 hover-up w-100"
                      type="submit"
                      name="login"
                      disabled={loading}
                    >
                      {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Zaten hesabınız var mı?
                    <Link href="/page-signin">
                      <span> Giriş Yap</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img className="shape-1" src="assets/imgs/page/login-register/img-1.svg" alt="Tüm Burslar" />
              </div>
              <div className="img-2">
                <img src="assets/imgs/page/login-register/img-2.svg" alt="Tüm Burslar" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

