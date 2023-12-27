import { cookies, headers } from "next/headers";
import jwt from 'jsonwebtoken'
export const checkLogger = async () => {
   try {
      const headersList = headers()
      let authHeader: any = headersList.get('Authorization')

      if (!authHeader) {
         const cookie = cookies().get('Authorization')
         if (cookie) {
            authHeader = `cookie ${cookie}`
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
         const user = {
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


