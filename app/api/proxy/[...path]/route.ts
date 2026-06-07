import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/env'
import {
  getAccessTokenFromRequest,
  getTenantIdFromRequest,
} from '@/lib/auth/server'
import { CORRELATION_HEADER } from '@/lib/api/interceptors/correlation'

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const token = await getAccessTokenFromRequest(request)
  const tenantId = await getTenantIdFromRequest(request)
  const path = pathSegments.join('/')
  const url = new URL(`${env.serverApiUrl}/${path}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)
  const correlationId = request.headers.get(CORRELATION_HEADER)
  if (correlationId) headers.set(CORRELATION_HEADER, correlationId)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (tenantId) headers.set('X-Tenant-Id', tenantId)

  const method = request.method
  const hasBody =
    method !== 'GET' && method !== 'HEAD' && method !== 'DELETE'
  const body = hasBody ? await request.arrayBuffer() : undefined

  const backendResponse = await fetch(url.toString(), {
    method,
    headers,
    body: hasBody ? body : undefined,
  })

  const responseHeaders = new Headers()
  const backendContentType = backendResponse.headers.get('content-type')
  if (backendContentType) responseHeaders.set('Content-Type', backendContentType)
  const backendCorrelation = backendResponse.headers.get(CORRELATION_HEADER)
  if (backendCorrelation) responseHeaders.set(CORRELATION_HEADER, backendCorrelation)

  const responseBody = await backendResponse.arrayBuffer()

  // 204/205/304 responses must not include a body
  if ([204, 205, 304].includes(backendResponse.status)) {
    return new NextResponse(null, {
      status: backendResponse.status,
      headers: responseHeaders,
    })
  }

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}
