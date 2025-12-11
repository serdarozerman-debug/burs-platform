import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next') || '/'
  const next = nextParam ? decodeURIComponent(nextParam) : '/'
  const type = requestUrl.searchParams.get('type') // 'signup' veya 'recovery'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Session oluşturuldu - user_profiles kaydını kontrol et ve oluştur
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('id', data.user.id)
          .single()

        // Eğer profile yoksa oluştur
        let userProfile = profile
        if (profileError && profileError.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email || '',
                full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
                role: 'student',
                avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
              },
            ])
            .select()
            .single()

          if (insertError) {
            console.error('Profile creation error:', insertError)
          } else {
            console.log('User profile created for:', data.user.email)
            userProfile = newProfile
          }
        }

        // Role'e göre redirect belirle
        let finalRedirect = next
        
        // Eğer next parametresi admin dashboard ise ve kullanıcı admin değilse ana sayfaya yönlendir
        if (next.includes('/admin') && (!userProfile || userProfile.role !== 'admin')) {
          console.log('Non-admin user trying to access admin dashboard, redirecting to home')
          finalRedirect = '/'
        } else if (userProfile && userProfile.role === 'admin' && (next === '/' || next === '')) {
          finalRedirect = '/admin/dashboard'
        } else if (userProfile && userProfile.role === 'student' && (next === '/' || next === '')) {
          finalRedirect = '/student/dashboard'
        } else if (userProfile && userProfile.role === 'organization' && (next === '/' || next === '')) {
          finalRedirect = '/organization/dashboard'
        }

        // Kullanıcıyı belirlenen sayfaya yönlendir
        const redirectUrl = new URL(finalRedirect, request.url)
        console.log(`Redirecting user ${data.user.email} (role: ${userProfile?.role || 'unknown'}) to ${finalRedirect}`)
        return NextResponse.redirect(redirectUrl)
      } catch (profileCheckError) {
        console.error('Profile check error:', profileCheckError)
        // Hata olsa bile ana sayfaya yönlendir
        const redirectUrl = new URL(next, request.url)
        return NextResponse.redirect(redirectUrl)
      }
    } else {
      console.error('Auth callback error:', error)
      // Hata durumunda login sayfasına yönlendir
      const redirectUrl = new URL('/page-signin?error=verification_failed', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Code yoksa login sayfasına yönlendir
  return NextResponse.redirect(new URL('/page-signin?error=no_code', request.url))
}
