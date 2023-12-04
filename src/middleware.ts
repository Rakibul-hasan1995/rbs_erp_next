import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function middleware(request: NextApiRequest) {
   try {
      const { method, url } = request;
      console.log(`[${method}] ${url}`);

      return NextResponse.next();
   } catch (error) {
      console.error('Error in middleware:', error);
      return NextResponse.error()
   }
}

export const config = {
   matcher: ['/api/v1/:path*'],
};
