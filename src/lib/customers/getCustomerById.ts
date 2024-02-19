import { User } from "@/app/api/mongoose/model/User";
import { Customer } from "@/types/customers";





type QueryCustomer = (id: string) => Promise<Customer>
export const getCustomerById: QueryCustomer = async (id) => {
   try {

      let customer = await User.findById(id)
         .exec()

      if (!customer) {
         throw new Error("Resource not found")
      }

      const data = {
         _id: customer._id,
         name: customer.user_name,
         email: customer.email
      }
      return data

   } catch (error: any) {
      throw error
   }
}
