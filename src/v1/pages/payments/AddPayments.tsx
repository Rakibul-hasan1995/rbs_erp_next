'use client';;
import moment from "moment";
import { ApiResponse, Axios } from "@/v1/utils/axios-config";
import toast from "react-hot-toast";
import OrderForm, { OrderInitialValues } from "@/v1/components/forms/orderForm";
import PaymentsForm, { PaymentInitialValues } from "@/v1/components/forms/PaymentForm";


interface SubmitResponse {
  success: boolean;
  errors: any | null;
}

const AddPayment = () => {
  const initialValues: PaymentInitialValues = {
    customer: null,
    date: moment().format('yy-MM-DD'),
    receipt_no: '',
    received_by: '',
    amount: 0,
    payment_mode: 'Cash',
    description: '',
    cheque_info: {
      cheque_date: moment().format('yy-MM-DD'),
      bank_name: undefined,
      branch_name: '',
      cheque_no: ''
    },
  }


  const submit = async (formData: any): Promise<SubmitResponse> => {
    try {
      const { data } = await toast.promise(
        Axios.post<ApiResponse>('/api/v1/payments', formData),
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


  return <PaymentsForm
    submit={submit}
    initialValues={initialValues}
  />
}






export default AddPayment