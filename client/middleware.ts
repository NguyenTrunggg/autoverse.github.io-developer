import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add custom header to indicate which layout to use
  const requestHeaders = new Headers(request.headers)
  const isDefaultLayout = !request.nextUrl.pathname.startsWith('/auth/login') && 
                         !request.nextUrl.pathname.startsWith('/admin')
                         
  requestHeaders.set('x-layout-type', isDefaultLayout ? 'default' : 'custom')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
} 