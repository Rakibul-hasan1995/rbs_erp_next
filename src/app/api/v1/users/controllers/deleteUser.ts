import { Trash } from "@/app/api/mongoose/model/Trash"
import { User } from "@/app/api/mongoose/model/User"


export const deleteUser = async (id: string) => {
  try {

    const user = await User.findById(id)
    if (!user) {
      return { code: 400, data: { filed: '_id', value: 'User Not Found' }, message: 'Data Not Found' }
    }

    let trash = new Trash({
      _id: user._id,
      data: JSON.stringify(user),
      collectionName: 'user'
    })
    await trash.save()
    await User.findByIdAndDelete(id)
    return {
      code: 200,
      message: "Successfully delete Data"
    }
  } catch (error) {
    return {
      code: 500, error
    }
  }
}