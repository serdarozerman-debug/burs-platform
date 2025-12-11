import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client with cookie support
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Scholarship = {
  id: string
  title: string
  slug: string
  organization_id: string
  organization?: {
    id: string
    name: string
    logo_url: string | null
    website: string
  }
  amount: number
  amount_type: string
  deadline: string
  description: string
  type: string
  education_level: string
  application_url: string
  is_active: boolean
  is_published?: boolean
  has_api_integration?: boolean
  created_at: string
}
