import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { customerBalanceSummary } from "@/lib/customers/getCustomerBalance";
import { getCustomerById } from "@/lib/customers/getCustomerById";



export const findCustomerById = async (req: Request, id: string) => {

   try {
      const expand = getQueryParams(req.url as string, 'expand', false)
      const customers = await getCustomerById(id)


      if (!expand) {
         return { data: customers, code: 200 }
      } else {
         const ids: any = [customers._id]
         const data = await customerBalanceSummary(ids)
         return { data: data[0], code: 200 }
      }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }

}