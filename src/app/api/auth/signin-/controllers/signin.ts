// // import { NextFunction, Request, Response } from "express"
// // import { User } from "../../../../model/User"

// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

// export const signin = async (req: Request, res: Response, next: NextFunction) => {
//    try {
//       const email: string = req.body.email
//       const password: string = req.body.password


//       const existUser = await User.findOne({ email })
//       if (!existUser || !existUser.password) {
//          return res.status(403).json({ code: 403, message: 'Invalid Credential', data: [{ field: 'email', value: 'invalid credential' }] })
//       }
//       const hashedPass = existUser.password

//       const isValid = await bcrypt.compare(password, hashedPass);

//       if (!isValid) {
//          return res.status(403).json({ code: 403, message: 'Invalid Credential', data: [{ field: 'email', value: 'invalid credential' }] })
//       }

//       const secret = process.env.JWT_SECRET

//       const access_token = jwt.sign({
//          user_name: existUser.user_name,
//          user_id: existUser._id,
//          roll: existUser.roll,
//       }, `${secret}`, {
//          expiresIn: '30d'
//       });

//       const response = {
//          code: 200,
//          message: 'Signin Successful',
//          data: {
//             access_token
//          },
//          links: {
//             signup: `/api/v1/auth/signup`,
//             self: `/api/v1/user/${existUser._id}`,
//             signin: '/api/v1/auth/signin'
//          }
//       }
//       res.status(200).json(response)

//    } catch (error: any) {
//       if (error && error.code === 11000) {
//          let err = {
//             code: 400,
//             message: 'Bad Request',
//             data: [{ email: `${req.body.email}: already exists` }]
//          }
//          return res.status(400).json(err)
//       }
//       next(error)
//    }
// }
