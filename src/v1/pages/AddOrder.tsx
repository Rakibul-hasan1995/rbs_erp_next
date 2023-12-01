'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import OrderForm, { OrderInitialValues } from "@/v1/components/forms/orderForm";


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const AddOrder = () => {
   const initialValues: OrderInitialValues = {
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
   }

   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(
            Axios.post<ApiResponse>('/api/v1/orders', formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            return { success: false, errors: data.data };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save order - ${data.data.order_name}`);
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


   return <OrderForm
      submit={submit}
      initialValues={initialValues}
   />
}






export default AddOrder