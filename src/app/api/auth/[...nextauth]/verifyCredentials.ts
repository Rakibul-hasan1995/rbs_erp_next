import { User } from "../../mongoose/model/User"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const verifyCredentials = async (credentials: any) => {
   try {
      const email: string = credentials.email
      const password: string = credentials.password


      const existUser = await User.findOne({ email })
      if (!existUser || !existUser.password) {
         return null
      }
      const hashedPass = existUser.password

      const isValid = await bcrypt.compare(password, hashedPass);

      if (!isValid) {
         return null
      }

      return existUser
      // const secret = process.env.JWT_SECRET

      // const access_token = jwt.sign({
      //    user_name: existUser.user_name,
      //    user_id: existUser._id,
      //    roll: existUser.roll,
      // }, `${secret}`, {
      //    expiresIn: '30d'
      // });

    
     

   } catch (error: any) {
      return null
   }
}