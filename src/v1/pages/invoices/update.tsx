'use client'
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import InvoiceForm, { InvoiceInitialValues } from "@/v1/components/forms/InvoiceForm";
import * as React from 'react'
import { useParams, useRouter } from "next/navigation";
import { InvoiceExpand } from "@/v1/utils/Types";
import { useThemeContext } from "@/v1/context/themeContext";

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}

const UpdateInvoice = () => {
   const initialValues: InvoiceInitialValues = {
      date: moment().format('yy-MM-DD'),
      customer: undefined,
      discount: 0,
      items: [],
      cover_photo: '',
      remarks: ''
   }
   const activePage = useParams();
   const id = activePage._id || "";

   const [data, setData] = React.useState<InvoiceInitialValues>(initialValues)
   const [loading, setLoading] = React.useState<boolean>(true)

   const { setTitle } = useThemeContext()
   React.useEffect(() => {
      if (id) {
         getInvoice()
      }
      return () => {
         setTitle("update invoice")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id])



   const getInvoice = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/invoices/${id}?expand=true`)
         const invoice = data.data
         setTitle(`update invoice : (${invoice.invoice_no})`)
         const initialValues = {
            date: moment(invoice.date).format('yy-MM-DD'),
            customer: { label: invoice.customer.user_name, value: invoice.customer._id },
            discount: invoice.discount,
            items: invoice.items,
            cover_photo: invoice.cover_photo,
            remarks: invoice.remarks
         }
         setLoading(false)
         setData(initialValues)

      } catch (error) {
         console.log(error)
      }
   }



   const router = useRouter();


   const submit = async (formData: any): Promise<SubmitResponse> => {
      try {
         const { data } = await toast.promise(
            Axios.put<ApiResponse>(`/api/v1/invoices/${id}`, formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            return { success: false, errors: data.data };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully update Invoice`);
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
         {!loading && <InvoiceForm
            submit={submit}
            initialValues={data}
         />}
      </>
   )
}






export default UpdateInvoice