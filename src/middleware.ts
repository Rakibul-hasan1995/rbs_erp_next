import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'


export async function middleware(request: NextApiRequest) {
   try {
      const { method, url } = request;
      console.log(`[${method}] ${url}`);

      // const headersList = headers()
      // const authHeader = headersList.get('authorization')

      // if (!authHeader) {
      //    return NextResponse.error()
      // }

      // const tokenParts = authHeader.split(" ");
      // if (tokenParts.length !== 2) {
      //    console.log('2')
      //    return NextResponse.error()
      // }
      // const token = tokenParts[1];
      // console.log('2a')

      // const validToken: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
      // console.log('2b')

      // if (validToken) {
      //    const role = validToken.roll;
      //    if (role === "admin") {
      //       const user = {
      //          id: validToken._id,
      //          name: validToken.user_name,
      //          roll: validToken.roll,
      //          email: validToken.email
      //       }
      //       console.log({ user })
      //       return NextResponse.next();

      //    } else {
      //       console.log('3')

      //       return NextResponse.error()

      //    }
      // } else {
      //    console.log('4')

      //    return NextResponse.error()
      // }


      return NextResponse.next()




   } catch (error) {
      console.error('Error in middleware:', error);
      return NextResponse.error()
   }
}

export const config = {
   matcher: ['/api/v1/:path*'],
};
