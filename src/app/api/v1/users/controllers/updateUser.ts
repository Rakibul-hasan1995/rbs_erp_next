import { updateUserValidation } from "@/app/api/lib/validation/updateUserValidation"
import { User } from "@/app/api/mongoose/model/User"

export const updateUserData = async (id:string, body: any) => {
  try {
   
    const user = await User.findById(id)
    if (!user) {
      return {
        code: 400,
        message: 'User Not Found'
      }
    }
    const validate = updateUserValidation(body)
    if (!validate.isValid) {
      return {
        code: 400,
        data: validate.error,
        message: 'Bad Request'
      }
    }


    Object.assign(user, validate.updates)
    await user.save()

    const response = {
      code: 200,
      message: 'Successfully update user',
      data: user
    }
    return response
  } catch (error: any) {
    return {
      error,
      code: 500,
      message: error.message
    }
  }
}





