import { getGroupPipeline } from "@/app/api/lib/getGroupPipeline";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Invoice } from "@/app/api/mongoose/model/Invoice";

export const getGroupInvoice = async (url: string) => {
   try {
      const start_date = getQueryParams(url as string, 'start_date', '');
      const end_date = getQueryParams(url as string, 'end_date', '');
      const group_by = getQueryParams(url as string, 'group_by', 'month');

      const { success, pipeline, error } = getGroupPipeline({ start_date, end_date, group_by })
      if (!success) {
         return error
      }

      // Execute aggregation
      const groupData = await Invoice.aggregate(pipeline);
      return {
         code: 200,
         data: groupData,
      }
   } catch (error: any) {
      return {
         code: 500,
         message: error.message,
         error
      }
   }
};

