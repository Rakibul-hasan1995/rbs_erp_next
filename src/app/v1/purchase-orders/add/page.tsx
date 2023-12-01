'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import PurchaseOrderForm, { PurchaseOrderInitialValues } from "@/v1/components/forms/PurchaseOrderForm";
import { useThemeContext } from "@/v1/context/themeContext";
import { useEffect } from "react";


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const page = () => {
   const initialValues: PurchaseOrderInitialValues = {
      order_date: moment().format('yy-MM-DD'),
      shipment_date: moment().add(15, 'days').format('yy-MM-DD'),
      supplier: null,
      order: null,
      qty: '',
      rate: '',
      status: '',
      description: '',
   }
   const { setTitle } = useThemeContext()
   useEffect(() => {
      setTitle("Add Purchase Order")
      return () => {
         setTitle("RBS")
      }
   }, [])
   const submit = async (formData: any): Promise<SubmitResponse> => {


      try {
         const { data } = await toast.promise(
            Axios.post<ApiResponse>('/api/v1/purchase-orders', formData),
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


   return <PurchaseOrderForm
      submit={submit}
      initialValues={initialValues}
   />
}






export default page