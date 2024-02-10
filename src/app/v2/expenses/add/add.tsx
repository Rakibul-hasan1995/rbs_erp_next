import { Axios } from '@/v1/utils/axios-config';
import React from 'react'
import toast from 'react-hot-toast';
import ExpenseForm from './ExpenseForm';
import moment from 'moment';
import { useTransactionContext } from '../TransactionProvider';


export default function AddExpense() {

   const {fetchData, state} = useTransactionContext()
   const initialValues = {
      amount: 0,
      reference: '',
      description: '',
      supplier_id: null,
      paid_from_account: null,
      paid_to_account: null,
      date: moment().format('yyyy-MM-DD')
   }

   const submit = async (formData: any) => {
      try {
         const { data } = await toast.promise(
            Axios.post('/api/v2/transactions', formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );
         if (data.code === 400) {
            return { success: false, errors: data.errors };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save Transaction `);
            fetchData(state.lastQuery)
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
   }


   return (
      <ExpenseForm initialValues={initialValues} submit={submit} />
   )
}
