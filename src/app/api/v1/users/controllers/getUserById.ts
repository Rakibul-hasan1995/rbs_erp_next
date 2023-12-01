
import { User } from "@/app/api/mongoose/model/User"
import { isValidObjectId } from "mongoose"


export const getUserById = async (id: string) => {
  try {
    const errResponse = {
      code: 400,
      message: 'Bad Request',
      data: [{ field: '_id', value: 'Please Provide Valid _id' }]
    }
    if (!isValidObjectId(id)) {
      return errResponse
    }
    const data = await User.findById(id)
    if (!data) {
      return errResponse
    }
    const response = {
      code: 200,
      data
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
