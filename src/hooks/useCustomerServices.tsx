import { Customer, CustomersGetApiResponse, CustomerQueryParams, ExtendCustomer, CustomerGetApiResponse } from '@/types/customers';
import { Axios } from '@/v1/utils/axios-config';
import { objToQueryString } from '@/v1/utils/queryString';
import * as React from 'react'
import toast from 'react-hot-toast';

type Loading = {
   customers: boolean;
   customer: boolean;
}

type FetchDataById = (arg: string, expand?: 'true' | 'false') => Promise<ExtendCustomer>
type FetchData = (arg?: CustomerQueryParams | string) => Promise<CustomersGetApiResponse<ExtendCustomer[]>>
type Query = (arg?: CustomerQueryParams | string) => Promise<CustomersGetApiResponse<ExtendCustomer[]>>

export interface UseService {
   // ====states=======>>
   customers: CustomersGetApiResponse<ExtendCustomer[]> | null;
   customer: CustomerGetApiResponse<ExtendCustomer> | null;

   loading: Loading;
   // <<====state end====

   // ====actions=======>>
   fetchDataById: FetchDataById;
   fetchData: FetchData;
   setCustomer: React.Dispatch<React.SetStateAction<CustomerGetApiResponse<ExtendCustomer> | null>>
   lastQuery?: string;
   // createOrder: CreateOrder;
   // updateOrder: UpdateOrder;
   // deleteOrder: DeleteOrder;

   clear: () => void;
   // <<====action end====
}


interface Arg {
   storeData?: boolean
}
const useCustomerServices = (arg: Arg) => {
   const { storeData = false } = arg

   const [customers, setCustomers] = React.useState<CustomersGetApiResponse<ExtendCustomer[]> | null>(null)
   const [customer, setCustomer] = React.useState<CustomerGetApiResponse<ExtendCustomer> | null>(null)
   const [loading, setLoading] = React.useState<Loading>({ customer: false, customers: false })
   const [lastQuery, setLastQuery] = React.useState<string>()

   const clear = () => {
      setCustomers(null)
      setCustomer(null)
      setLoading({ customer: false, customers: false })
      setLastQuery(undefined)
   }

   const fetchDataById: FetchDataById = async (id, expand = 'true') => {
      setLoading((prev) => ({ ...prev, customer: true }));
      if (customer && customer.data?._id == id) {
         setLoading((prev) => ({ ...prev, customer: false }));
         return customer
      }
      try {
         const { data } = await Axios.get(`/api/v2/customers/${id}?expand=${expand}`);
         if (storeData) {
            setCustomer(data.data);
         }
         return data.data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, customer: false }));
      }
   };

   const fetchData: FetchData = async (query) => {

      const res = await queryData(query)
      if (storeData) {
         setCustomers(res)
      }
      return res
   };

   const queryData: Query = async (query) => {
      setLoading((prev) => ({ ...prev, customers: true }));
      let queryStr
      if (typeof query == 'object') {
         queryStr = objToQueryString(query)
      } else {
         queryStr = query
      }

      if (customers && lastQuery == queryStr) {
         console.log('cashed')
         setLoading((prev) => ({ ...prev, customers: false }));
         return customers
      }

      try {
         const { data } = await Axios.get(`/api/v2/customers?${queryStr}`);
         setLastQuery(queryStr)
         return data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, customers: false }));
      }
   };

   const data: UseService = {
      fetchDataById,
      fetchData,
      clear,
      setCustomer,

      customer,
      customers,
      loading,
      lastQuery
   }
   return data
}


export default useCustomerServices