import { TransactionFormatted, TransactionQueryParams, TransactionsApiResponse } from '@/types/transaction';
import { Axios } from '@/v1/utils/axios-config';
import { objToQueryString } from '@/v1/utils/queryString';
import * as React from 'react'
import toast from 'react-hot-toast';


let initialQuery: TransactionQueryParams = {
   limit: '20',
   page: '1',
   sort_key: "program_name",
   sort_type: 'desc'
}

type Loading = {
   transaction: boolean;
   transactions: boolean;
}
type FetchTransactionById = (arg: string) => Promise<TransactionFormatted>
type FetchTransactions = (arg?: TransactionQueryParams) => Promise<TransactionsApiResponse>
type QueryTransactions = (arg?: TransactionQueryParams) => Promise<TransactionsApiResponse>
// type CreateOrder = (arg: Order) => Promise<Response>
// type UpdateOrder = (arg: Order, id: string) => Promise<Response>
// type DeleteOrder = (id: string) => Promise<boolean>

export interface UseTransactionServices {
   // ====states=======>>
   transactions: TransactionsApiResponse | null;
   transaction?: TransactionFormatted;
   loading: Loading;
   // <<====state end====

   // ====actions=======>>
   fetchTransactionById: FetchTransactionById;
   fetchTransactions: FetchTransactions;

   // createOrder: CreateOrder;
   // updateOrder: UpdateOrder;
   // deleteOrder: DeleteOrder;

   clear: () => void;
   // <<====action end====
}


interface Arg {
   storeData?: boolean
}
const useTransactionServices = (arg: Arg) => {
   const { storeData = false } = arg

   const [transactions, setTransactions] = React.useState<TransactionsApiResponse | null>(null)
   const [transaction, setTransaction] = React.useState<TransactionFormatted>()
   const [loading, setLoading] = React.useState<Loading>({ transaction: false, transactions: false })

   const clear = () => {
      setTransactions(null)
      setTransaction(undefined)
      setLoading({ transaction: false, transactions: false })
   }



   const fetchTransactionById: FetchTransactionById = async (id) => {
      setLoading((prev) => ({ ...prev, transaction: true }));
      if (transaction && transaction._id == id) {
         setLoading((prev) => ({ ...prev, transaction: false }));
         return transaction
      }
      try {
         const { data } = await Axios.get(`/api/v2/transactions/${id}`);
         if (storeData) {
            setTransaction(data.data);
         }
         return data.data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, transaction: false }));

      }
   };

   const fetchTransactions: FetchTransactions = async (params) => {
      const res = await queryTransaction({ ...params })
      if (storeData) {
         setTransactions(res)
      }
      return res
   };

   const queryTransaction: QueryTransactions = async (query = {}) => {
      setLoading((prev) => ({ ...prev, transactions: true }));

      const queryObj: TransactionQueryParams = { ...initialQuery, ...query }
      const queryStr = objToQueryString(queryObj)
      try {
         const { data } = await Axios.get(`/api/v2/transactions?${queryStr}`);
         return data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, transactions: false }));
      }
   };

   const data: UseTransactionServices = {
      fetchTransactionById,
      fetchTransactions,
      clear,

      transactions,
      transaction,
      loading,
   }
   return data
}


export default useTransactionServices