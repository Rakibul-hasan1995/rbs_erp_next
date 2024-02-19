import { Order, OrderExpand, OrderGetApiResponse, OrderQueryParams, OrderSearchQueryParams } from '@/types/orders';
import { Axios } from '@/v1/utils/axios-config';
import { objToQueryString } from '@/v1/utils/queryString';
import * as React from 'react'
import toast from 'react-hot-toast';

type Loading = {
   orders: boolean;
   order: boolean;
   search: boolean
}

// type FetchDataById = (arg: string, expand?: 'true' | 'false') => Promise<ExtendCustomer>
type FetchData = (arg?: OrderQueryParams) => Promise<OrderGetApiResponse<OrderExpand[]>>
type Search = (arg?: OrderSearchQueryParams | string) => Promise<Order[]>



export interface UseOrderService {
   // ====states=======>>
   orders: OrderGetApiResponse<OrderExpand[]> | null;
   // order: CustomerGetApiResponse<ExtendCustomer> | null;

   loading: Loading;
   // <<====state end====

   // ====actions=======>>
   // fetchDataById: FetchDataById;
   fetchData: FetchData
   search: Search
   lastQuery?: string;

   clear: () => void;
   // <<====action end====
}


interface Arg {
   storeData?: boolean
}
const useOrderServices = (arg: Arg) => {
   const { storeData = false } = arg

   const [orders, setOrders] = React.useState<OrderGetApiResponse<OrderExpand[]> | null>(null)
   // const [order, setCustomer] = React.useState<CustomerGetApiResponse<ExtendCustomer> | null>(null)
   const [loading, setLoading] = React.useState<Loading>({ order: false, orders: false, search: false })
   const [lastQuery, setLastQuery] = React.useState<string>()

   const clear = () => {
      setOrders(null)
      // setCustomer(null)
      setLoading({ order: false, orders: false, search: false })
      setLastQuery(undefined)
   }

   // const fetchDataById: FetchDataById = async (id, expand = 'true') => {
   //    setLoading((prev) => ({ ...prev, order: true }));
   //    if (order && order.data?._id == id) {
   //       setLoading((prev) => ({ ...prev, order: false }));
   //       return order
   //    }
   //    try {
   //       const { data } = await Axios.get(`/api/v2/customers/${id}?expand=${expand}`);
   //       if (storeData) {
   //          setCustomer(data.data);
   //       }
   //       return data.data;
   //    } catch (error: any) {
   //       console.error(error)
   //       const message = error.response?.data?.message || 'An error occurred';
   //       toast.error(message)
   //    } finally {
   //       setLoading((prev) => ({ ...prev, order: false }));
   //    }
   // };



   const fetchData: FetchData = async (query) => {
      setLoading((prev) => ({ ...prev, orders: true }));
      let queryStr = objToQueryString({ ...query, expand: 'true' })


      if (orders && lastQuery == queryStr) {
         console.log('cashed')
         setLoading((prev) => ({ ...prev, orders: false }));
         return orders
      }

      try {
         const { data } = await Axios.get(`/api/v1/orders?${queryStr}`);
         setLastQuery(queryStr)
         if (storeData) {
            setOrders(data)
         }
         return data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, orders: false }));
      }
   };

   const searchData: Search = async (query) => {
      setLoading((prev) => ({ ...prev, orders: true }));
      let queryStr
      if (typeof query == 'string') {
         queryStr = query
      } else {
         queryStr = objToQueryString(query)
      }

      try {
         const { data } = await Axios.get(`/api/v1/orders?${queryStr}&expand=false`);

         return data.data;
      } catch (error: any) {
         console.error(error)
         const message = error.response?.data?.message || 'An error occurred';
         toast.error(message)
      } finally {
         setLoading((prev) => ({ ...prev, orders: false }));
      }
   };

   const data: UseOrderService = {

      fetchData,
      clear,
      search: searchData,

      orders,
      loading,
      lastQuery
   }
   return data
}


export default useOrderServices