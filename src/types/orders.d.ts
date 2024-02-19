import { Pagination } from ".";


export interface Order {
   _id: string;
   customer: {
      _id: string;
      user_name: string;
      exchange_rate: number
   };
   order_name: string;
   program_name: string;
   qty: number;
   rate: number;
   currency: string;
   unit: string;
   stitching?: number;
   category?: string;
   tags?: string[];
   description?: string;
   order_date?: string;
   shipment_date?: string;
   status: string;
   image_gallery?: {
      _id: string;
      href: string
   }[];
   cover_photo: string;
   delivery_qty?: number | 0;
   receive_qty?: number | 0;
   production_qty?: number | 0;
   invoice_amount?: number | 0
}

export interface OrderExpand {
   _id: string;
   customer: {
      _id: string;
      user_name: string;
      exchange_rate: number
   };
   order_name: string;
   program_name: string;
   qty: number;
   rate: number;
   currency: string;
   unit: string;
   stitching?: number;
   category?: string;
   tags?: string[];
   description?: string;
   order_date?: string;
   shipment_date?: string;
   status: string;
   image_gallery?: {
      _id: string;
      href: string
   }[];
   cover_photo: {
      href: string;
      _id: string
   };
   delivery_qty?: number | 0;
   receive_qty?: number | 0;
   production_qty?: number | 0;
   invoice_amount?: number | 0
}




export type OrderGetApiResponse<T extends Order[] | OrderExpand[]> = {
   code: number;
   data?: T;
   pagination: Pagination
}
export type CustomerGetApiResponse<T extends ExtendCustomer | Customer> = {
   code: number;
   data?: T;
}


export type OrderQueryParams = {
   page: number,
   limit: number,
   sort_type?: string,
   sort_key?: string,
   search?: string,
   search_by?: string,
   filter_key?: string,
   filter_value?: string,
   status?: 'Invoiced' | ''
}
export type OrderSearchQueryParams = {
   page?: number,
   limit: number,
   sort_type?: string,
   sort_key?: string,
   search?: string,
   search_by?: string,
   filter_key?: string,
   filter_value?: string,
   status?: 'Invoiced' | ''
}
