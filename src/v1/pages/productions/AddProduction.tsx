'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import ProductionForm, { ProductionInitialValue } from "../../components/forms/ProductionForm";
import { useEffect } from "react";
import { useThemeContext } from "@/v1/context/themeContext";


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const AddProduction = () => {
   const initialValues: ProductionInitialValue = {
      date: moment().subtract(1, 'day').format('yy-MM-DD'),
      shift: 'Day Shift',
      production_data: [{
         machine_no: 1,
         order: undefined,
         qty: 0,
         operator: undefined,
         helper: "",
         remarks: "",
      }],

      total_amount: 0,
      remarks: ''
   }
   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(
            Axios.post<ApiResponse>('/api/v1/productions', formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            return { success: false, errors: data.data };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save Production`);
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


   const { setTitle } = useThemeContext()
   useEffect(() => {
      setTitle("Add Production")
      return () => { setTitle('RBS') }
   }, [])

   return <ProductionForm
      submit={submit}
      initialValues={initialValues}
   />
}






export default AddProduction