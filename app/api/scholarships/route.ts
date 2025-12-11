import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Query parametrelerini al
    const search = searchParams.get('search')
    const types = searchParams.getAll('type').filter(Boolean)
    const educationLevels = searchParams.getAll('education_level').filter(Boolean)
    const organizations = searchParams.getAll('organization').filter(Boolean)
    const minAmount = searchParams.get('min_amount')
    const maxAmount = searchParams.get('max_amount')
    const daysLeft = searchParams.get('days_left')
    const sort = searchParams.get('sort') ?? 'deadline_asc'
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')

    // Base query oluştur - count için
    let countQuery = supabase
      .from('scholarships')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_published', true)
    
    // Data query - with organization join
    let query = supabase
      .from('scholarships')
      .select(`
        *,
        organization:organization_id (
          id,
          name,
          logo_url,
          website
        )
      `)
      .eq('is_active', true)
      .eq('is_published', true)

    // Organization name'lerden organization_id'leri bul (case-insensitive exact match)
    let organizationIds: string[] = []
    if (organizations.length > 0) {
      // Her bir organization name için case-insensitive exact match yap
      const orgPromises = organizations.map(async (orgName: string) => {
        const orgResult = await supabase
          .from('organizations')
          .select('id')
          .ilike('name', orgName)
          .limit(1)
        
        return orgResult.data?.[0]?.id
      })
      
      const orgIds = await Promise.all(orgPromises)
      organizationIds = orgIds.filter((id): id is string => id !== undefined)
    }

    // Filtreleri hem count hem data query'sine uygula
    const applyFilters = (q: any, orgIds: string[] = []) => {
      // Search filtresi
      if (search) {
        q = q.ilike('title', `%${search}%`)
      }

      // Type filtresi
      if (types.length > 0) {
        q = q.in('type', types)
      }

      // Education level filtresi
      if (educationLevels.length > 0) {
        q = q.in('education_level', educationLevels)
      }

      // Organization filtresi - organization_id'ye göre filtreleme
      if (orgIds.length > 0) {
        q = q.in('organization_id', orgIds)
      }

      // Amount filtreleri
      if (minAmount) {
        const minAmountNum = parseFloat(minAmount)
        if (!isNaN(minAmountNum)) {
          q = q.gte('amount', minAmountNum)
        }
      }

      if (maxAmount) {
        const maxAmountNum = parseFloat(maxAmount)
        if (!isNaN(maxAmountNum)) {
          q = q.lte('amount', maxAmountNum)
        }
      }

      // Days left filtresi
      if (daysLeft) {
        const daysNum = parseInt(daysLeft)
        if (!isNaN(daysNum) && daysNum > 0) {
          const today = new Date()
          const maxDate = new Date()
          maxDate.setDate(today.getDate() + daysNum)
          
          q = q
            .gte('deadline', today.toISOString().split('T')[0])
            .lte('deadline', maxDate.toISOString().split('T')[0])
        }
      }
      
      return q
    }
    
    // Filtreleri uygula
    countQuery = applyFilters(countQuery, organizationIds)
    query = applyFilters(query, organizationIds)

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

    // Pagination uygula
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Count ve data'yı al
    const [countResult, dataResult] = await Promise.all([
      countQuery,
      query
    ])

    if (dataResult.error) {
      console.error('Supabase error:', dataResult.error)
      return NextResponse.json(
        { error: dataResult.error.message },
        { status: 500 }
      )
    }

    if (countResult.error) {
      console.error('Supabase count error:', countResult.error)
      return NextResponse.json(
        { error: countResult.error.message },
        { status: 500 }
      )
    }


    // Response with count
    return NextResponse.json({
      data: dataResult.data || [],
      total: countResult.count || 0,
      page: page,
      limit: limit,
      totalPages: Math.ceil((countResult.count || 0) / limit)
    })
  } catch (error: any) {
    console.error('API error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: error?.message || 'Internal server error', details: error?.toString() },
      { status: 500 }
    )
  }
}