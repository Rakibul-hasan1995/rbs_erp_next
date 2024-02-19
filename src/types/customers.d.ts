import { Pagination } from ".";

interface Contact {
   address: string;
   phone: string;
   contactParsonName: string;
}

export type ExtendCustomer = {
   email: string;
   name: string;
   roll?: 'customer';
   _id: string;

   contact_details?: Contact;
   payment_amount?: number;
   settlement_amount?: number;
   invoice_amount?: number;

   payment_amount_formatted?: string;
   settlement_amount_formatted?: string;
   invoice_amount_formatted?: string;
   closing_amount?: number;
   closing_amount_formatted?: string;
   status: string;
}

export type Customer = {
   email: string;
   name?: string;
   roll?: 'customer';
   _id: string;
}

export type CustomersGetApiResponse<T extends ExtendCustomer[] | Customer[]> = {
   code: number;
   data?: T;
   pagination: Pagination
}
export type CustomerGetApiResponse<T extends ExtendCustomer | Customer> = {
   code: number;
   data?: T;
}


export type CustomerQueryParams = {
   page: number,
   limit: number,
   sort_type?: string,
   sort_key?: string,
   search?: string,
   search_by?: string,
   expand?: 'true' | 'false';
   status?: 'active' | 'inactive' | 'pending'
}

export type GetCustomerByIdQueryParams = {
   expand?: 'true' | 'false';
}

