'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import ChallanForm, { ChallanInitialValues } from "@/v1/components/forms/ChallanForm";
import { useThemeContext } from "@/v1/context/themeContext";
import { useEffect } from "react";

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const AddProduction = () => {

   const { setTitle } = useThemeContext()
   useEffect(() => {
      setTitle('Add Receive Challan')
      return () => { setTitle('RBS') }
   }, [])


   const initialValues: ChallanInitialValues = {
      date: moment().format('yy-MM-DD'),
      customer: '',
      challan_no: 0,
      bag_qty: 0,
      items: [
         {
            order: undefined,
            qty: 0,
            emb_reject_qty: 0,
            fabric_reject_qty: 0,
            remarks: '',

         }
      ],
      remarks: ''
   }
   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(
            Axios.post<ApiResponse>('/api/v1/receive-challans', formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            return { success: false, errors: data.data };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save Challan`);
            return { success: true, errors: null };
         }

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


   return <ChallanForm
      submit={submit}
      initialValues={initialValues}
   />
}






export default AddProduction