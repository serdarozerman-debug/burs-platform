"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Redirect parametresini al
  const redirect = searchParams.get('redirect') || null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const redirectPath = redirect || '/';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google ile giriş yaparken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        console.error('Error code:', error.status);
        console.error('Error message:', error.message);
        
        // More specific error messages
        if (error.message.includes("Invalid login credentials") || error.message.includes("Email rate limit exceeded")) {
          setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-postanızı kontrol edin.");
        } else if (error.message.includes("User not found")) {
          setError("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı. Google ile giriş yapmayı deneyin veya kayıt olun.");
        } else if (error.message.includes("Password") || error.message.includes("signup_disabled")) {
          setError("Bu hesap Google ile kayıt olmuş görünüyor. Lütfen 'Google ile Giriş Yap' butonunu kullanın.");
        } else {
          setError(`${error.message || "Giriş yaparken bir hata oluştu"} (Kod: ${error.status || 'bilinmiyor'})`);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Wait a moment for session to be set in cookies
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verify session is set
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          setError('Oturum oluşturulamadı. Lütfen tekrar deneyin.');
          setLoading(false);
          return;
        }

        // User profile bilgilerini al
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirect based on role or redirect parameter
        let redirectPath = '/';
        if (redirect) {
          // Decode redirect parameter
          try {
            redirectPath = decodeURIComponent(redirect);
          } catch (e) {
            redirectPath = redirect;
          }
        } else if (profile?.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (profile?.role === 'student') {
          redirectPath = '/student/dashboard';
        } else if (profile?.role === 'organization') {
          redirectPath = '/organization/dashboard';
        }
        
        setLoading(false);
        // Force a full page reload to ensure session cookies are set
        // Use window.location.replace to avoid adding to history
        window.location.replace(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "Giriş yaparken bir hata oluştu");
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
                  <p className="font-sm text-brand-2">Tekrar hoş geldiniz!</p>
                  <h2 className="mt-10 mb-5 text-brand-1">Üye Girişi</h2>
                  <p className="font-sm text-muted mb-30">Tüm özelliklere erişim. Kredi kartı gerekmez.</p>
                  <button
                    className="btn social-login hover-up mb-20"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <img src="assets/imgs/template/icons/icon-google.svg" alt="BursBuldum" />
                    <strong>Google ile Giriş Yap</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Veya devam edin</span>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-20" role="alert" style={{ padding: "12px", borderRadius: "4px", backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" }}>
                    <strong>Hata:</strong> {error}
                  </div>
                )}

                <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-1">
                      E-posta Adresi *
                    </label>
                    <input
                      className="form-control"
                      id="input-1"
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
                  <div className="login_footer form-group d-flex justify-content-between">
                    <label className="cb-container">
                      <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        disabled={loading}
                      />
                      <span className="text-small">Beni hatırla</span>
                      <span className="checkmark" />
                    </label>
                    <Link href="/page-contact">
                      <span className="text-muted">Şifremi Unuttum</span>
                    </Link>
                  </div>
                  <div className="form-group">
                    <button
                      className="btn btn-brand-1 hover-up w-100"
                      type="submit"
                      name="login"
                      disabled={loading}
                    >
                      {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Hesabınız yok mu?
                    <Link href="/page-register">
                      <span> Kayıt Ol</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img className="shape-1" src="assets/imgs/page/login-register/img-4.svg" alt="Tüm Burslar" />
              </div>
              <div className="img-2">
                <img src="assets/imgs/page/login-register/img-3.svg" alt="Tüm Burslar" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

