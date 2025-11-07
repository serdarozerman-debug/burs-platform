import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Scholarship = {
  id: string
  title: string
  organization: string
  organization_logo: string | null
  amount: number
  amount_type: string
  deadline: string
  description: string
  type: string
  education_level: string
  application_url: string
  is_active: boolean
  created_at: string
}
