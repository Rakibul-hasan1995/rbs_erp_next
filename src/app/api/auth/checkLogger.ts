import { headers } from "next/headers";
import jwt from 'jsonwebtoken'
export const checkLogger = async () => {
   try {
      const headersList = headers()
      const authHeader = headersList.get('Authorization')

      if (!authHeader) {
         return null
      }

      const tokenParts = authHeader.split(" ");
     
      if (tokenParts.length !== 2) {

         return null
      }
      const token = tokenParts[1];

      console.log(token)

      const validToken: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
      console.log(3)


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


