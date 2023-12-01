

interface Pipeline {
   start_date: string;
   end_date: string;
   group_by: 'day' | 'month' | 'year'
}
interface Response {
   pipeline: any;
   success: boolean;
   error: any
}


export const getGroupPipeline: (arg: Pipeline) => Response = (arg) => {

   const { start_date, end_date, group_by } = arg
   // Parse dates
   const startDate = new Date(start_date as string);
   const endDate = new Date(end_date as string);

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
            totalAmount: { $sum: '$amount' }
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
            totalAmount: { $sum: '$amount' }
         }
      };
   } else if (group_by === 'year') {
      groupStage = {
         $group: {
            _id: {
               year: { $year: '$date' }
            },
            totalAmount: { $sum: '$amount' }
         }
      };
   } else {
      return { error: { message: 'Invalid group_by parameter' }, code: 400, pipeline: null, success: false }
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
   return { pipeline, success: true, error: null }
}