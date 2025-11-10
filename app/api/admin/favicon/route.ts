import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Favicon eksik kurumları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const missing = searchParams.get("missing") === "true";

    let query = supabase
      .from("scholarships")
      .select("organization, organization_logo")
      .eq("is_active", true);

    if (missing) {
      query = query.or("organization_logo.is.null,organization_logo.eq.");
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by organization
    const organizations = new Map();
    data?.forEach((item) => {
      if (!organizations.has(item.organization)) {
        organizations.set(item.organization, {
          name: item.organization,
          logo: item.organization_logo,
          hasFavicon: !!(item.organization_logo && item.organization_logo.trim()),
        });
      }
    });

    const result = Array.from(organizations.values());

    return NextResponse.json({
      total: result.length,
      organizations: result,
      missing: result.filter((o) => !o.hasFavicon).length,
    });
  } catch (error: any) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Favicon güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organization, favicon_url } = body;

    if (!organization || !favicon_url) {
      return NextResponse.json(
        { error: "Organization and favicon_url required" },
        { status: 400 }
      );
    }

    // Update all scholarships from this organization
    const { data, error } = await supabase
      .from("scholarships")
      .update({ organization_logo: favicon_url })
      .eq("organization", organization)
      .eq("is_active", true);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Favicon updated for ${organization}`,
    });
  } catch (error: any) {
    console.error("Error updating favicon:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Toplu favicon güncelleme
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of {organization, favicon_url}

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Updates array required" },
        { status: 400 }
      );
    }

    const results = [];

    for (const update of updates) {
      const { organization, favicon_url } = update;
      
      if (organization && favicon_url) {
        const { error } = await supabase
          .from("scholarships")
          .update({ organization_logo: favicon_url })
          .eq("organization", organization)
          .eq("is_active", true);

        results.push({
          organization,
          success: !error,
          error: error?.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      updated: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error: any) {
    console.error("Error batch updating favicons:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

