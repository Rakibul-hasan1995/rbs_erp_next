
import { User } from '@/app/api/mongoose/model/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const signin = async (email: string, password: string) => {
   try {

      const existUser = await User.findOne({ email })
      if (!existUser || !existUser.password) {
         return { code: 403, message: 'Invalid Credential', data: [{ field: 'email', value: 'invalid credential' }] }
      }
      const hashedPass = existUser.password

      const isValid = await bcrypt.compare(password, hashedPass);

      if (!isValid) {
         return { code: 403, message: 'Invalid Credential', data: [{ field: 'email', value: 'invalid credential' }] }
      }

      const secret = process.env.JWT_SECRET

      const access_token = jwt.sign({
         name: existUser.user_name,
         id: existUser._id,
         roll: existUser.roll,
         email: existUser.email,
      }, `${secret}`, {
         expiresIn: '30d'
      });



      cookies().set('Authorization', access_token)
      const response = {
         code: 200,
         message: 'Signin Successful',
         data: {
            access_token
         },
         links: {
            signup: `/api/v1/auth/signup`,
            self: `/api/v1/user/${existUser._id}`,
            signin: '/api/v1/auth/signin'
         }
      }
      return response

   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
}
