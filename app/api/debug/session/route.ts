import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    let profile = null
    if (session) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role')
        .eq('id', session.user.id)
        .single()
      
      profile = data
    }

    // Get all cookies
    const allCookies: Record<string, string> = {}
    cookieStore.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value.substring(0, 50) + '...'
    })

    return NextResponse.json({
      success: true,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        expires_at: session.expires_at,
      } : null,
      profile: profile,
      sessionError: sessionError?.message,
      cookies: allCookies,
      cookieCount: cookieStore.getAll().length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}

