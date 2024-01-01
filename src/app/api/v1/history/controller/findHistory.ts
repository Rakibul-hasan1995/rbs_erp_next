import { checkLogger } from "@/app/api/auth/checkLogger";
import { History } from "@/app/api/mongoose/model/OrderHistory";
import dbConnect from '@/app/api/mongoose/mongoose';
import mongoose from "mongoose";

export const findHistory = async (parentId = ''): Promise<any> => {
   try {
      const user = await checkLogger()
      if (!user) {
         return { code: 401, message: 'access denied' }
      }
      await dbConnect()
      if (!parentId) {
         return { message: '"parent_id" not found', code: 400 }
      }
      const history = History.find({ parentId: new mongoose.Types.ObjectId(parentId) }).sort({ createdAt: -1 })

      if (user.roll == 'admin') {
         const data = await history.exec()

         return { data, code: 200 }
      } else {
         const data = await history.select('-snapshot -data').exec()
         return { data, code: 200 }
      }
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
};
