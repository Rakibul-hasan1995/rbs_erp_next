import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
   try {
      const { method, nextUrl } = request;
      console.log(`[${method}] ${nextUrl.pathname}?${nextUrl.search}`);
      return NextResponse.next()
   } catch (error) {
      console.error('Error in middleware:', error);
      return NextResponse.error()
   }
}

export const config = {
   matcher: ['/api/v1/:path*'],
};

