import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Query parametrelerini al
    const search = searchParams.get('search')
    const types = searchParams.getAll('type').filter(Boolean)
    const educationLevels = searchParams.getAll('education_level').filter(Boolean)
    const minAmount = searchParams.get('min_amount')
    const maxAmount = searchParams.get('max_amount')
    const daysLeft = searchParams.get('days_left')
    const sort = searchParams.get('sort') ?? 'deadline_asc'

    // Base query oluştur
    let query = supabase
      .from('scholarships')
      .select('*')
      .eq('is_active', true)

    // Search filtresi: title veya organization içinde ara (case-insensitive)
    if (search) {
      query = query.or(`title.ilike.%${search}%,organization.ilike.%${search}%`)
    }

    // Type filtresi
    if (types.length > 0) {
      query = query.in('type', types)
    }

    // Education level filtresi
    if (educationLevels.length > 0) {
      query = query.in('education_level', educationLevels)
    }

    // Minimum amount filtresi
    if (minAmount) {
      const minAmountNum = parseFloat(minAmount)
      if (!isNaN(minAmountNum)) {
        query = query.gte('amount', minAmountNum)
      }
    }

    // Maximum amount filtresi
    if (maxAmount) {
      const maxAmountNum = parseFloat(maxAmount)
      if (!isNaN(maxAmountNum)) {
        query = query.lte('amount', maxAmountNum)
      }
    }

    // Days left filtresi: son başvuru tarihi X gün içinde olanlar
    if (daysLeft) {
      const daysNum = parseInt(daysLeft)
      if (!isNaN(daysNum) && daysNum > 0) {
        const today = new Date()
        const maxDate = new Date()
        maxDate.setDate(today.getDate() + daysNum)
        
        // Bugünden itibaren X gün içindeki deadline'ları filtrele
        query = query
          .gte('deadline', today.toISOString().split('T')[0])
          .lte('deadline', maxDate.toISOString().split('T')[0])
      }
    }

    // Sıralama
    switch (sort) {
      case 'amount_desc':
        query = query.order('amount', { ascending: false })
        break
      case 'amount_asc':
        query = query.order('amount', { ascending: true })
        break
      case 'created_desc':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('deadline', { ascending: true })
        break
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}