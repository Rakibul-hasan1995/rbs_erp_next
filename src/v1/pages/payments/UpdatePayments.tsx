'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import PaymentsForm, { PaymentInitialValues } from "@/v1/components/forms/PaymentForm";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


interface SubmitResponse {
  success: boolean;
  errors: any | null;
}

const AddPayment = () => {
  const activePage = useParams()
  const _id = activePage._id
  const router = useRouter()

  const [data, setData] = useState()

  const fetch = async () => {
    try {
      const { data } = await Axios.get(`/api/v1/payments/${_id}`)
      const payment = data.data

      setData({
        ...payment,
        customer: { label: payment.customer.user_name, value: payment.customer._id },
        date: moment(payment.date).format('yy-MM-DD'),
        cheque_info: { ...payment.cheque_info, cheque_date: moment(payment.cheque_info?.cheque_date).format('yy-MM-DD'), bank_name: payment?.cheque_info?.bank_name || '' },
      })


    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetch()
  }, [])


  const submit = async (formData: any): Promise<SubmitResponse> => {
    try {
      const { data } = await toast.promise(
        Axios.put<ApiResponse>(`/api/v1/payments/${_id}`, formData),
        {
          loading: 'updating...',
          success: <b>Data Updated!</b>,
          error: <b>Could not update.</b>,
        }
      );

      if (data.code === 400) {
        return { success: false, errors: data.data };
      } else if (data.code === 200 || data.code === 201) {
        toast.success(`Successfully update payment`);
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
      {data && <PaymentsForm
        submit={submit}
        initialValues={data}
      />}
    </>
  )
}






export default AddPayment