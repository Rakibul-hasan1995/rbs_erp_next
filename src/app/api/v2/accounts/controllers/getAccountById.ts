
import mongoose from "mongoose";
import moment from "moment";
import { Account } from "@/app/api/mongoose/model/account";
import { getClosingAmount } from "@/app/api/lib/accounts/getAccountClosingAmount";
import { TransactionRaw } from "@/types/transaction";
import { queryTransactions } from "@/app/api/lib/transactions/queryTransactions";
import { getAccountTotalDebitCreditBalanceRow } from "@/app/api/lib/accounts/getAccountTotalDebitCreditBalanceRow";
import { getAccountOpeningBalanceRow } from "@/app/api/lib/accounts/getAccountOpeningBalanceRow";
import { getAccountClosingBalanceRow } from "@/app/api/lib/accounts/getAccountClosingAmountRow";
import { getQueryParams } from "@/app/api/lib/getQueryParams";

export const getAccountById = async (url: any, id: string) => {
   try {

      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'createdAt')
      const start_date = getQueryParams(url as string, 'start_date', undefined)
      const end_date = getQueryParams(url as string, 'end_date', undefined)
      const expand = getQueryParams(url as string, 'expand', false)

      const account: any = await Account.findById(id)
         .populate('createdBy', 'user_name roll')
         .exec()


      let data = { ...account?._doc }
      const closingBalance = await getClosingAmount(data._id)
      data.closing_balance = account.account_type == 'Income' ? -closingBalance : closingBalance

      const transactionFilter: mongoose.FilterQuery<TransactionRaw> = {
         account_id: data._id
      }
      if (start_date && end_date) {
         transactionFilter.date = {
            $gte: moment(start_date).startOf('D').toISOString(),
            $lte: moment(end_date).endOf('D').toISOString(),
         }
      }

      const { data: transactions, pagination } = await queryTransactions({
         page,
         limit,
         sortType,
         sortKey,
         filter: transactionFilter
      })

      if (!expand) {
         data.transactions = transactions
         return {
            code: 200,
            data,
         }
      }


      const totalDCRow = await getAccountTotalDebitCreditBalanceRow({ accountId: data._id, endDate: end_date, startDate: start_date, isDebit: data.isDebit })
      transactions.push(totalDCRow)

      const openingBalanceRow = await getAccountOpeningBalanceRow({ accountId: data._id, startDate: start_date, isDebit: data.isDebit })
      transactions.unshift(openingBalanceRow)

      const closingBalanceRow = await getAccountClosingBalanceRow({ accountId: data._id, endDate: end_date, startDate: start_date })
      transactions.push(closingBalanceRow)



      if (start_date && end_date) {
         data.dateRange = `From ${moment(start_date).format('DD MMM yyyy')} To ${moment(end_date).format('DD MMM yyyy')}`
      }
      data.pagination = pagination
      data = { ...data, transactions }

      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}

