
'use client'
import React, { createContext, useState, useContext } from 'react';
import { Pagination } from '../components/table/paginationBar';
import { _arrToObjBy_id } from '../utils/arrToObjBy_id';
import { Axios, serverUrl } from '../utils/axios-config';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';



export interface Order {
   _id: string;
   customer: {
      _id: string;
      user_name: string
   };
   order_name: string;
   program_name?: string;
   qty: number;
   rate: number;
   currency: string;
   unit: string;
   stitching?: number;
   category?: string;
   tags?: string[];
   description?: string;
   order_date?: string;
   shipment_date?: string;
   status: string;
   image_gallery?: {
      _id: string;
      href: string
   }[];
   cover_photo: {
      href: string;
      _id: string
   };
   delivery_qty?: number | 0;
   receive_qty?: number | 0;
   production_qty?: number | 0;
   invoice_amount: number | 0
}






export type Type = {
   state: Record<string, Order>;
   setState: React.Dispatch<React.SetStateAction<any>>;
   fetchOrder: (arg: string) => void;
   pagination: Pagination;
   setPagination: (arg: Pagination | any) => void;
   handleUpdateOrder: (arg: any) => any

};

export const OrderContext = createContext<Type | undefined>(undefined);



const initialPagination = {
   nextPage: null,
   prevPage: null,
   currentPage: 1,
   totalPages: 0,
   totalDocuments: 0,
   limit: 25
}


export const OrderProvider = ({ children }: { children: any }) => {
   const [state, setState] = useState<Record<string, Order>>({});
   const [pagination, setPagination] = React.useState<Pagination>(initialPagination)


   const fetchOrder = async (str: string) => {
      console.log('fetched');
      try {
         const { data } = await Axios.get(`/api/v1/orders?limit=${pagination.limit}&${str}`)
         const obj = _arrToObjBy_id(data.data)
         setState(obj)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }

   const handleUpdateOrder = async (api: any) => {
      try {
         const field = api.column.colId
         const value = api.value

         const obj = { [field]: value }
         const id = api.data._id

         const { data } = await Axios.put(`api/v1/orders/${id}`, obj)

         if (data.code == 200) {
            toast.success(`successfully update ${data.data.order_name} - ${field}`)
         }
      } catch (error) {
         console.log(error)
         toast.error(`error in update Order`)
      }
   }



   const handleSocket = async (socket: any) => {
      socket.on("changes", (data: any) => {
         const oldData = state[data._id]
         if (oldData) {
            state[data._id] = { ...oldData, ...data }
            // setState((prev: any) => {
            //    return { ...prev, [newData._id]: newData }
            // })

            // setState((prevState: any) => ({
            //    ...prevState,
            //    [newData._id]: newData
            // }));
         }
      });
      socket.on("fetch", async (_id: any) => {
         try {
            const { data } = await Axios.get(`/api/v1/orders/${_id}?expand=true`)
            if (data.code == 200) {
               // orderActions.add(data.data)
            }
         } catch (error) {
            console.log(error)
         }
         // orderActions.add(data)
         // console.log('insert', data);
      });
      socket.on("fetch-all", async () => {
         // orderActions.fetch(query ? query : '&expand=true')
      });
      socket.on("delete", (_id: string) => {
         console.log('delete', _id);

      });

   }


   React.useEffect(() => {
      const socket = io(`${serverUrl}/api/v1/orders`);
      // handleSocket(socket)
      return () => {
         socket.disconnect()
         // setState({})
         // setPagination({
         //    nextPage: null,
         //    prevPage: null,
         //    currentPage: 1,
         //    totalPages: 0,
         //    totalDocuments: 0,
         //    limit: 25
         // })
      }
   }, [state])







   const value = {
      state,
      setState,
      fetchOrder,
      pagination,
      setPagination,
      handleUpdateOrder
   }
   return (
      <OrderContext.Provider value={value}>
         {children}
      </OrderContext.Provider>
   );
};

export const useOrderContext = () => {
   const context = useContext(OrderContext);
   if (!context) {
      throw new Error('useTheme must be used within a OrderProvider');
   }
   return context;
};
