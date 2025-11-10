import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { scholarship_id, firstName, lastName, email, phone, message } = body

    // Validation
    if (!scholarship_id || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurunuz' },
        { status: 400 }
      )
    }

    // Save application to database
    const applicationData = {
      scholarship_id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Başvuru kaydedilemedi' },
        { status: 500 }
      )
    }

    // TODO: Kuruma e-posta gönder veya API call yap

    return NextResponse.json({
      success: true,
      message: 'Başvurunuz başarıyla alındı',
      application: data,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

