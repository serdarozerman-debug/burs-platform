"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect parametresini al
  const redirect = searchParams.get('redirect') || '/';

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const redirectPath = redirect && redirect !== '/' ? redirect : '/admin/dashboard';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError(err.message || "Google ile giriş yaparken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        console.error('Error code:', signInError.status);
        console.error('Error message:', signInError.message);
        
        if (signInError.message.includes("Invalid login credentials") || signInError.message.includes("Email rate limit exceeded")) {
          setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-postanızı kontrol edin.");
        } else if (signInError.message.includes("User not found")) {
          setError("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı. Google ile giriş yapmayı deneyin veya kayıt olun.");
        } else if (signInError.message.includes("Password")) {
          setError("Bu hesap Google ile kayıt olmuş görünüyor. Lütfen 'Google ile Giriş Yap' butonunu kullanın.");
        } else {
          setError(`${signInError.message || "Giriş yaparken bir hata oluştu"} (Kod: ${signInError.status || 'bilinmiyor'})`);
        }
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        console.log('Login successful, user:', data.user.email);
        console.log('Session:', data.session ? 'exists' : 'missing');
        
        // User profile bilgilerini al
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        console.log('Profile:', profile);

        // Redirect based on role or redirect parameter
        let redirectPath = '/';
        if (redirect && redirect !== '/') {
          // Decode redirect parameter
          try {
            redirectPath = decodeURIComponent(redirect);
          } catch (e) {
            console.error('Redirect decode error:', e);
            redirectPath = redirect;
          }
        } else if (profile?.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (profile?.role === 'student') {
          redirectPath = '/student/dashboard';
        } else if (profile?.role === 'organization') {
          redirectPath = '/organization/dashboard';
        }
        
        console.log('Redirecting to:', redirectPath);
        setLoading(false);
        
        // Use router.push first, then force reload if needed
        router.push(redirectPath);
        router.refresh();
        
        // Fallback: Force reload after a short delay
        setTimeout(() => {
          if (window.location.pathname !== redirectPath) {
            console.log('Fallback redirect to:', redirectPath);
            window.location.href = redirectPath;
          }
        }, 500);
      } else {
        setError('Oturum oluşturulamadı. Lütfen tekrar deneyin.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Giriş yaparken bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Giriş Yap
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Veya{' '}
              <Link href="/page-register" className="font-medium text-blue-600 hover:text-blue-500">
                öğrenci olarak kayıt ol
              </Link>
              {' / '}
              <Link href="/page-register" className="font-medium text-blue-600 hover:text-blue-500">
                kurum olarak kayıt ol
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Giriş Yap
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Veya</span>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/page-contact" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
