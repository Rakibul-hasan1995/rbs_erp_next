import { headers } from 'next/headers';
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function middleware(request: NextApiRequest) {

   const method = request.method
   const url = request.url
   console.log(`[${method}]: ${url}`)

   return NextResponse.next();

   // const authorization = request.headers['Authorization'];

   // const headersList = headers()
   // const referer = headersList.get('Authorization')


   // if (referer) {
   //    return NextResponse.next();
   // }else{
   //    return NextResponse.json({ message: 'authorization failed' }, { status: 401 })
   // }

}
export const config = {
   matcher: '/api/v1/:path*',
}