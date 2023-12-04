'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import * as React from 'react';
import { useThemeContext } from "@/v1/context/themeContext";
import ProductionForm, { ProductionInitialValue } from "@/v1/components/forms/ProductionForm";


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const UpdateProduction = () => {

   const activePage = useParams()
   const _id = activePage._id


   const [initialValues, setInitialValues] = React.useState<ProductionInitialValue>({
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
   })


   const { setTitle } = useThemeContext()

   React.useEffect(() => {
      fetchProductionForUpdate()
      setTitle(`Update Production: ${moment(initialValues.date).format('DD-MM')}/${initialValues.shift}  `)
      return () => { setTitle('RBS') }
   }, [])




   const fetchProductionForUpdate = async () => {
      try {
         const { data } = await Axios.get<ApiResponse>(`/api/v1/productions/${_id}?expand=true`)
         // setInitialValues(data.data)

         const item = data.data

         const value: ProductionInitialValue = {
            date: moment(item.date).subtract(1, 'day').format('yy-MM-DD'),
            shift: item.shift,
            total_amount: item.total_amount,
            production_data: item.production_data.map((x: any) => {
               return {
                  _id: x._id,
                  machine_no: x.machine_no,
                  qty: x.qty,
                  remarks: x.remarks,
                  helper: x.helper,
                  operator: { label: x.operator.user_name, value: x.operator._id },
                  order: {
                     label: `${x.order.program_name} ${x.order.order_name} (${x.order.status?.[0]})`,
                     value: x.order,
                     avatar: x.order.cover_photo.href,
                  }
               }
            }),
            remarks: item.remarks
         }

         setInitialValues(value)

      } catch (error) {
         console.log(error);
      }
   }

   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(
            Axios.put<ApiResponse>(`/api/v1/productions/${_id}`, formData),
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

   return <ProductionForm
      submit={submit}
      initialValues={initialValues}
   />
}






export default UpdateProduction