import { getGroupPipeline } from "@/app/api/lib/getGroupPipeline";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Payment } from "@/app/api/mongoose/model/Payment";

export const getGroupPayment = async (url: string,) => {
   try {

      const start_date: any = getQueryParams(url as string, 'start_date', '');
      const end_date = getQueryParams(url as string, 'end_date', '');
      const group_by = getQueryParams(url as string, 'group_by', 'month');
      const filter = {
         key: 'payment_mode',
         value: 'Settlement'
      }


      const { success, pipeline, error } = getGroupPipeline({ start_date, end_date, group_by, filter })
      if (!success) {
         return error
      }
      // Execute aggregation
      const groupData = await Payment.aggregate(pipeline);
      return {
         code: 200,
         data: groupData.filter((data) => data.payment_mode !== 'Settlement')
      }
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
};





