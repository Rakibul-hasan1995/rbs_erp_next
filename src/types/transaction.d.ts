import mongoose from "mongoose";
import { Pagination } from ".";

export type TransactionRaw = {
   date: any
   account_id?: string;
   _id: string;
   customer_id?: string;
   paid_from_account?: string;
   paid_to_account?: string;
   ref_id?: string[]; //customer id , supplier id ,  user id, employee id
   supplier_id?: string;
   description?: string;
   debit_amount?: number;
   credit_amount?: number;
   transaction_details?: string;
   type?: string;
   status?: string;
   reference: string;
   image?: string;
   relative_id?: string;



}

export type TransactionFormatted = TransactionRaw & {
   date_formatted?: string;
   account_id: {
      account_name: string;
      _id: string
   } | any;
   paid_to_account?: {
      account_name: string;
      _id: string
   } | any;
   paid_from_account?: {
      account_name: string;
      _id: string
   } | any;
   customer_id?: {
      user_name: string;
      _id: string | any
   }
   supplier_id?: {
      user_name: string;
      _id: string | any
   }
   transaction_details?: string;
   debit_amount_formatted?: string;
   credit_amount_formatted?: string;
   relative_id?: string
}
type TransactionsApiResponse = {
   code: number;
   data: TransactionFormatted[];
   dateRange: string;
   pagination: Pagination
}


export type TransactionQueryParams = {
   limit?: string;
   page?: string;
   filter_key?: 'status';
   filter_value?: string;
   search?: string;
   search_by?: 'type' | "debit_amount" | 'credit_amount' | "reference" | '';
   sort_type?: "desc" | 'asc';
   sort_key?: string;
   start_date?: string;
   end_date?: string;
   expand?: 'true' | 'false';
   is_debit?: 'true' | 'false';
   is_credit?: 'true' | 'false';
}

