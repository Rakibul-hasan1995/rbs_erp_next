import { cookies, headers } from "next/headers";
import jwt from 'jsonwebtoken'
export interface AuthUser {
   name: string;
   email: string;
   roll: string;
   id: string
}

export const checkLogger = async (): Promise<AuthUser | null> => {
   try {
      const headersList = headers()
      let authHeader: any = headersList.get('Authorization')

      if (!authHeader) {
         const cookie = cookies().get('Authorization')
         if (cookie) {
            authHeader = `cookie ${cookie.value}`
         } else {
            return null
         }
      }
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2) {
         return null
      }
      const token = tokenParts[1];

      const validToken: any = jwt.verify(token, `${process.env.JWT_SECRET}`);

      if (validToken) {
         const user: AuthUser = {
            id: validToken.id,
            name: validToken.name,
            roll: validToken.roll,
            email: validToken.email
         }
         return user
      } else {
         console.log('4')

         return null
      }

   } catch (error) {
      return null
   }
}


