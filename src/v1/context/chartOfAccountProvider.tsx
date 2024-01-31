
'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Pagination } from '../components/table/paginationBar';
import { _arrToObjBy_id } from '../utils/arrToObjBy_id';
import { Axios } from '../utils/axios-config';
import toast from 'react-hot-toast';

interface AccountDocument {
   _id: string;
   account_name: string;
   account_type: string;
   is_debit: boolean;
   is_system_account: boolean;
   status: 'active' | 'inactive';
   description?: string;
   createdBy: string
}




type State = {
   accounts?: AccountDocument[];
   account?: AccountDocument & { closing_balance: number; transactions: any[] };
   loadingAccount: boolean;
   loadingAccounts: boolean;
}

export type Type = {
   state: State
   setState: React.Dispatch<React.SetStateAction<State>>;
   fetchData: (arg: string) => void;
   pagination: Pagination;
   setPagination: (arg: Pagination | any) => void;
   handleUpdateOrder: (arg: any) => any;
   fetchDataById: (arg: string) => any
};

export const COAContext = createContext<Type | undefined>(undefined);

const initialPagination = {
   nextPage: null,
   prevPage: null,
   currentPage: 1,
   totalPages: 0,
   totalDocuments: 0,
   limit: 25
}


export const ChartOfAccountProvider = ({ children }: { children: any }) => {
   const [state, setState] = useState<State>({
      loadingAccount: false,
      loadingAccounts: false
   });
   const [pagination, setPagination] = React.useState<Pagination>(initialPagination)


   useEffect(() => {
      fetchData('')
   }, [])


   const fetchData = async (str: string) => {
      setState((prev) => ({ ...prev, loadingAccounts: true }))
      try {
         const { data } = await Axios.get(`/api/v1/accounts?limit=${pagination.limit}&${str}`)
         setState((prev) => ({ ...prev, accounts: data.data }))
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      } finally {
         setState((prev) => ({ ...prev, loadingAccount: false }))

      }
   }



   const fetchDataById = async (id: string) => {
      setState((prev) => ({ ...prev, loadingAccount: true }))
      try {
         const { data } = await Axios.get(`/api/v1/accounts/${id}`)
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
      pagination,
      setPagination,
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
