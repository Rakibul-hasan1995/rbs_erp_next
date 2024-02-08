
'use client'

import { TransactionFormatted } from '@/types/transaction';
import { Pagination } from '@/v1/components/table/paginationBar';
import { Axios } from '@/v1/utils/axios-config';
import { objToQueryString } from '@/v1/utils/queryString';
import React, { createContext, useState, useContext, useEffect } from 'react';


type Query = {
   limit?: number;
   sort_key?: string;
   sort_type?: string;
   start_date?: string;
   end_date?: string;
   page?: number;
   expand?: 'true' | 'false'
};



interface AccountDocument {
   _id: string;
   account_name: string;
   account_type: string;
   is_debit: boolean;
   is_system_account: boolean;
   status: 'active' | 'inactive';
   description?: string;
   createdBy: string;
}


type ExpandTransaction = {
   closing_balance: number;
   transactions?: TransactionFormatted[],
   dateRange: string,

}

type State = {
   accounts?: AccountDocument[];
   account?: AccountDocument & ExpandTransaction & { pagination: Pagination };
   loadingAccount: boolean;
   loadingAccounts: boolean;
}

export type Type = {
   state: State
   setState: React.Dispatch<React.SetStateAction<State>>;
   fetchData: (arg: string) => void;
   handleUpdateOrder: (arg: any) => any;
   fetchDataById: (arg: string, query?: Query) => any
};

export const COAContext = createContext<Type | undefined>(undefined);


export const ChartOfAccountProvider = ({ children }: { children: any }) => {
   const [state, setState] = useState<State>({
      loadingAccount: false,
      loadingAccounts: false
   });

   // useEffect(() => {
   //    fetchData('')
   // }, [])


   const fetchData = async (str: string) => {
      setState((prev) => ({ ...prev, loadingAccounts: true }))
      try {
         const { data } = await Axios.get(`/api/v2/accounts?limit=200&${str}`)
         setState((prev) => ({ ...prev, accounts: data.data }))
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingAccounts: false }))

      }
   }

   const fetchDataById = async (id: string, query?: Query) => {

      const queryStr = objToQueryString(query)
      
      setState((prev) => ({ ...prev, loadingAccount: true }))
      try {
         const { data } = await Axios.get(`/api/v2/accounts/${id}?${queryStr}`)
         setState((prev) => ({ ...prev, account: data.data }))
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingAccount: false }))
      }
   }

   const handleUpdateOrder = async (api: any) => {
      // try {
      //    const field = api.column.colId
      //    const value = api.value

      //    const obj = { [field]: value }
      //    const id = api.data._id

      //    const { data } = await Axios.put(`api/v1/orders/${id}`, obj)

      //    if (data.code == 200) {
      //       toast.success(`successfully update ${data.data.order_name} - ${field}`)
      //    }
      // } catch (error) {
      //    console.log(error)
      //    toast.error(`error in update Order`)
      // }
   }

   const value: Type = {
      state,
      setState,
      fetchData,

      handleUpdateOrder,
      fetchDataById
   }
   return (
      <COAContext.Provider value={value}>
         {children}
      </COAContext.Provider>
   );
};

export const useChartOfAccountContext = () => {
   const context = useContext(COAContext);
   if (!context) {
      throw new Error('useTheme must be used within a OrderProvider');
   }
   return context;
};
