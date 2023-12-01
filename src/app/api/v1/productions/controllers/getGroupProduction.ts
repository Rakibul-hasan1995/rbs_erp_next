import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Production } from "@/app/api/mongoose/model/Production";

export const getGroupProduction = async (url: string,) => {
   try {
      const start_date: any = getQueryParams(url as string, 'start_date', '');
      const end_date = getQueryParams(url as string, 'end_date', '');
      const group_by = getQueryParams(url as string, 'group_by', 'month');

      
      const startDate = new Date(start_date as string);
      const endDate = new Date(end_date as string);

      if (group_by === 'group-data') {
         // Perform a different operation or return an error response if needed
         return { code: 400, message: 'some thing went wrong' }
      }


      // Match stage for date range
      const matchStage: any = {
         $match: {
            date: {
               $gte: startDate,
               $lte: endDate
            }
         }
      };

      // Group stage based on the selected grouping
      let groupStage: any = {};
      if (group_by === 'month') {
         groupStage = {
            $group: {
               _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' }
               },
               totalAmount: { $sum: '$total_amount' }
            }
         };
      } else if (group_by === 'day') {
         groupStage = {
            $group: {
               _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' },
                  day: { $dayOfMonth: '$date' }
               },
               totalAmount: { $sum: '$total_amount' }
            }
         };
      } else if (group_by === 'year') {
         groupStage = {
            $group: {
               _id: {
                  year: { $year: '$date' }
               },
               totalAmount: { $sum: '$total_amount' }
            }
         };
      } else {
         return {code: 400, message:  'some thing went wrong'}
      }

      // Pipeline
      const pipeline: any[] = [
         matchStage,
         groupStage,
         {
            $project: {
               _id: 0,
               year: '$_id.year',
               month: '$_id.month',
               day: '$_id.day',
               totalAmount: 1
            }
         },
         {
            $sort: {
               year: 1,
               month: 1,
               day: 1
            }
         }
      ];


      // Execute aggregation
      const groupData = await Production.aggregate(pipeline);
      return {
         code: 200,
         data: groupData,
      }
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
};
