/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination } from '@/v1/components/table/paginationBar';
import { _arrToObjBy_id } from '@/v1/utils/arrToObjBy_id';
import { Axios, serverUrl } from '@/v1/utils/axios-config';
import * as React from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client'

export default function useOrderSocket(query?: string) {
   const [state, setState] = React.useState<any>({})
   const [pagination, setPagination] = React.useState<Pagination>({
      nextPage: null,
      prevPage: null,
      currentPage: 1,
      totalPages: 0,
      totalDocuments: 0,
      limit: 25
   },)

   const fetch = async (str: string) => {
      try {
         const { data } = await Axios.get(`/api/v1/orders?${query}&${str}&limit=${pagination.limit}`)
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
         const oldData: any = state[data._id]
         if (oldData) {
            const newData = { ...oldData, ...data }
            // setState((prev: any) => {
            //    return { ...prev, [newData._id]: newData }
            // })

            setState((prevState: any) => ({
               ...prevState,
               [newData._id]: newData
            }));
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
      handleSocket(socket)
      return () => {
         socket.disconnect()
         //  setState([]), setPagination({
         //    nextPage: null,
         //    prevPage: null,
         //    currentPage: 1,
         //    totalPages: 0,
         //    totalDocuments: 0,
         //    limit: 25
         // })
      }
   }, [state])



   return { fetch, rowData: Object.values(state), pagination, setPagination, handleUpdateOrder }
}
