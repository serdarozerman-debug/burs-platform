import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Try to read favicon.ico from public directory
    const publicFaviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    
    if (fs.existsSync(publicFaviconPath)) {
      const faviconBuffer = fs.readFileSync(publicFaviconPath)
      return new NextResponse(faviconBuffer, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
    
    // Return 204 No Content instead of 500 error
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Favicon error:', error)
    return new NextResponse(null, { status: 204 })
  }
}

