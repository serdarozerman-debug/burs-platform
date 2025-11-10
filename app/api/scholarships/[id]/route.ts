import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Scholarship ID required' },
        { status: 400 }
      );
    }

    // Fetch scholarship with organization data
    const { data, error } = await supabase
      .from('scholarships')
      .select(`
        *,
        organization:organization_id (
          id,
          name,
          slug,
          logo_url,
          website,
          type,
          description
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('scholarships')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
