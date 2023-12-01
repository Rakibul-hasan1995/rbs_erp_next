'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import OrderForm from "@/v1/components/forms/orderForm";
import { useParams, useRouter } from "next/navigation";
import * as React from 'react'

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const UpdateOrder = () => {
   const activePage = useParams()
   const _id = activePage._id
   const router = useRouter()


   React.useEffect(() => {
      fetch()
   }, [])

   const [loading, setLoading] = React.useState(true)
   const [initialValues, setInitialValues] = React.useState({
      order_name: '',
      stitching: '',
      order_date: moment().format('yy-MM-DD'),
      shipment_date: moment().add(15, 'days').format('yy-MM-DD'),
      customer: null,
      qty: '',
      rate: '',
      currency: 'BDT',
      unit: 'Pcs',
      category: 't-shirt',
      status: '',
      tags: 'Design',
      description: '',
      cover_photo: null
   })




   const fetch = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/orders/${_id}`)
         const order = data.data

         setInitialValues({
            ...order,
            customer: { label: order.customer.user_name, value: order.customer._id },
            cover_photo: { _id: order.cover_photo._id, href: order.cover_photo.href },
            order_date: moment(order.order_date).format('yy-MM-DD'),
            shipment_date: moment(order.shipment_date).add(15, 'days').format('yy-MM-DD'),
         })

         setLoading(false)

      } catch (error) {
         console.log(error)
      }
   }

   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(

            Axios.put<ApiResponse>(`/api/v1/orders/${_id}`, formData),
            {
               loading: 'Updating...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            return { success: false, errors: data.data };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save order - ${data.data.order_name}`);
            router.back()
            return { success: true, errors: null };
         }

         // Add a default return statement if none of the conditions are met
         return { success: false, errors: 'Unexpected response code' };
      } catch (err: any) {
         if (err.response) {
            const { data, message } = err.response;
            toast.error(message || 'error');
            return { success: false, errors: data };
         }

         // Handle other types of errors and return a default response
         return { success: false, errors: 'Unexpected error' };
      }
   };


   return (
      <>
         {loading ? <>loading...</> : <OrderForm
            submit={submit}
            initialValues={initialValues}
         />}
      </>
   )
}


export default UpdateOrder