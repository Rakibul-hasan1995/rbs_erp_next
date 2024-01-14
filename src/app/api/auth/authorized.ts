import { cookies, headers } from "next/headers";
import jwt from 'jsonwebtoken'
import { User } from "../mongoose/model/User";
export interface AuthUser {
   name: string;
   email: string;
   roll: string;
   id: string
}

export const authorized = async (roles = ['admin']) => {

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
         if (roles.includes(user.roll)) {
            const userData = await User.findOne({ email: validToken.email })
            if (userData?.status !== 'Approved') {
               return null
            } else {
               return user
            }

         } else {
            return null
         }

      } else {
         return null
      }

   } catch (error) {
      return null
   }
}


