
'use client'
import { Pagination } from '@/app/api/lib/generatePagination copy';
import { TransactionFormatted, TransactionRaw } from '@/types/transaction';
import { Axios } from '@/v1/utils/axios-config';
import { objToQueryString } from '@/v1/utils/queryString';
import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

type Query = {
   limit?: number;
   sort_key?: string;
   search_by?: string;
   search?: string;
   sort_type?: string;
   start_date?: string;
   end_date?: string;
   page?: number;
   expand?: 'true' | 'false';
   is_debit?: 'true' | 'false';
   is_credit?: 'true' | 'false';
};


type State = {
   transactions?: TransactionFormatted[] & { pagination?: Pagination };
   loadingTransactions: boolean;
   transaction?: TransactionFormatted;
   loadingTransaction: boolean;
   lastQuery: Query
}

export type Type = {
   state: State
   setState: React.Dispatch<React.SetStateAction<State>>;
   fetchData: (query?: Query) => void;
   fetchDataById: (arg: string, query?: Query) => any;
   updateTransaction: (id: string, data: Partial<TransactionRaw>) => void
};

export const TransactionContext = createContext<Type | undefined>(undefined);


export const TransactionProvider = ({ children }: { children: any }) => {
   const [state, setState] = useState<State>({
      loadingTransaction: false,
      loadingTransactions: false,
      lastQuery: {}
   });


   const fetchData = async (query?: Query) => {
      setState((prev) => ({ ...prev, loadingTransactions: true }))
      const queryStr = objToQueryString(query)

      try {
         const { data } = await Axios.get(`/api/v2/transactions?${queryStr}`)
         setState((prev) => ({ ...prev, transactions: data.data, lastQuery: query || {} }))
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingTransactions: false }))
      }
   }



   const fetchDataById = async (id: string,) => {
      setState((prev) => ({ ...prev, loadingTransaction: true }))
      try {
         const { data } = await Axios.get(`/api/v2/transactions/${id}`)
         setState((prev) => ({ ...prev, transaction: data.data }))
         return data.data
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingTransaction: false }))
      }
   }
   const updateTransaction = async (id: string, body?: Partial<TransactionRaw>) => {
      try {
         const { data } = await Axios.put(`/api/v2/transactions/${id}`, body)
         toast.success('Uploaded')
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingAccount: false }))
      }
   }


   const value: Type = {
      state,
      setState,
      fetchData,
      fetchDataById,
      updateTransaction
   }
   return (
      <TransactionContext.Provider value={value}>
         {children}
      </TransactionContext.Provider>
   );
};

export const useTransactionContext = () => {
   const context = useContext(TransactionContext);
   if (!context) {
      throw new Error('useTheme must be used within a OrderProvider');
   }
   return context;
};
