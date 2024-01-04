import { cookies, headers } from "next/headers";
import jwt from 'jsonwebtoken'
export interface AuthUser {
   name: string;
   email: string;
   roll: string;
   id: string
}

export const checkLoggerMiddleware = async (token: string): Promise<AuthUser | null> => {
   try {
     

      const validToken: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
console.log({validToken})
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


