import { getServerSession } from "next-auth"
import { authOptions } from "./authOptions"


interface User {
   name: string;
   email: string;
   id: string;
   roll: string
}


export const checkLogger = async (): Promise<User | null> => {
   const session = await getServerSession(authOptions)
   if (!session?.user) {
      return null
   }

   const name = session.user.name || ''
   const email = session.user.email || ''
   const image = JSON.parse(session.user.image || "")
   const id = image._id
   const roll = image.roll

   const user: User = { name, email, id, roll }

   return user
}