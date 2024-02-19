import { Account } from "@/app/api/mongoose/model/account"
import { Transaction } from "@/app/api/mongoose/model/transaction"
import { numberWithCommas } from "@/v1/utils/numberFormater"
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import moment from "moment"
import generatePagination from "@/app/api/lib/generatePagination copy"
import mongoose from "mongoose"
import { TransactionRaw } from "@/types/transaction"
import { _arrSum } from "@/v1/utils/arrSum"




export async function getExpenseByCategory(url: any) {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 100)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'account_name')
      const start_date = getQueryParams(url as string, 'start_date', moment().startOf('month').toISOString())
      const end_date = getQueryParams(url as string, 'end_date', moment().endOf('month').toISOString())
      const skip = (page - 1) * limit;


      const accounts = await Account.find({ account_type: 'Expense' })
      const ids = accounts.map((item) => { return item._id })



      const transactions = await Transaction.aggregate([
         {
            $match: {
               account_id: { $in: ids },
               date: {
                  $gte: new Date(start_date),
                  $lte: new Date(end_date)
               }
            },
         },
         {
            $group: {
               _id: '$account_id',
               amount: { $sum: '$credit_amount' },
            },
         },

      ]);

      const pp = transactions.reduce((result, item) => {
         result[item._id] = item.amount;
         return result;
      }, {});



      const total = _arrSum(transactions, 'amount')

      const trIds = transactions.map((item: any) => { return item._id })

      const acc = await Account.find({ _id: { $in: trIds } })
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType == 'desc' ? -1 : 1 })


      let data = acc.map((acc) => {
         return {
            _id: acc._id,
            account_name: acc.account_name,
            amount: pp[acc._id] || 0,
            amount_formatted: numberWithCommas(pp[acc._id] || 0)
         };
      });

      const count = await Account.countDocuments({ account_type: 'Expense' })
      const pagination = generatePagination(page, limit, count)

      const response = {
         code: 200,
         data,
         pagination,
         total,
         total_formatted: numberWithCommas(total),
         dateRange: `From ${moment(start_date).format('DD MMM yyyy')} To ${moment(end_date).format('DD MMM yyyy')}`,
      }



      return response

   } catch (error) {
      console.log(error)
      return { code: 500, error }
   }
}

