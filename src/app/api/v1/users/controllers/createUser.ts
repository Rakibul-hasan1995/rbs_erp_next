import { userValidate } from "@/app/api/lib/validation/userValidateion"
import { User, UserDocument } from "@/app/api/mongoose/model/User"


interface Response {
  code: number;
  message?: string;
  data: any
}



export const createUser = async (user: UserDocument): Promise<Response> => {

  try {
    const existUser = await User.findOne({ email: user.email })
    if (existUser) {
      const value = {
        code: 400, message: 'Bad Request',
        data: [{ field: 'email', value: 'email already Registered' }]
      }
      return value
    }

    const validate = userValidate(user)
    if (!validate.isValid) {

      const value = {
        code: 400, message: 'Bad Request',
        data: validate.error
      }
      return value
    }
    const data = new User(user)
    // const data = await User.create(user)
    // res.status(201).json({ code: 201, data, links: [{ self: `/api/v1/users/${data.id}` }] })

    const value = {
      code: 201,
      message: 'Success',
      data
    }
    return value

  } catch (error: any) {
    let err = {
      code: 400,
      message: 'Bad Request',
      data: null,
      error: error
    }
    return err
  }
}
