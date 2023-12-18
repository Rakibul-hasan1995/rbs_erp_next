
import { userSignupValidate } from '@/app/api/lib/validation/userValidateion'
import { User } from '@/app/api/mongoose/model/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (body: any,) => {
   try {
      const email: string = body.email
      const password: string = body.password
      const user_name: string = body.user_name || email?.split('@')[0]

      const existUser = await User.findOne({ email })
      if (existUser) {
         return { code: 400, message: 'Bad Request', data: [{ field: 'email', value: 'User already Registered' }] }
      }

      const validate = userSignupValidate({ email, password })
      if (!validate.isValid) {

         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const count = await User.countDocuments({})

      const hashedPassword = await bcrypt.hash(password, 5);
      const user = {
         email,
         user_name,
         password: hashedPassword,
         roll: count === 0 ? 'admin' : 'user'
      }

      const auth = new User(user)

      await auth.save()

      const secret = process.env.JWT_SECRET

      const access_token = jwt.sign({
         user_name: auth.user_name,
         user_id: auth._id,
         roll: auth.roll,
      }, `${secret}`, {
         expiresIn: '30d'
      });

      const response = {
         code: 201,
         message: 'Signup Successful',
         data: {
            access_token
         },
         links: {
            signup: `/api/v1/auth/signup`,
            self: `/api/v1/user/${auth._id}`,
            signin: '/api/v1/auth/signin'
         }
      }
      return response


   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}
