
'use client';
import useCustomerServices, { UseService } from '@/hooks/useCustomerServices';
import { CustomerGetApiResponse, CustomerQueryParams, CustomersGetApiResponse, ExtendCustomer } from '@/types/customers';
import { objToQueryString, queryStringToJSON } from '@/v1/utils/queryString';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { createContext, useState, useContext, useEffect } from 'react';


type State = {
   customers: CustomersGetApiResponse<ExtendCustomer[]> | undefined;
   customer: CustomerGetApiResponse<ExtendCustomer> | undefined;
   lastQuery?: CustomerQueryParams
}


export const CustomerContext = createContext<UseService | undefined>(undefined);


export const CustomerProvider = ({ children }: { children: any }) => {

   const services = useCustomerServices({ storeData: true })



   // routing =========>>>
   const searchParams = useSearchParams()
   const router = useRouter()
   const pathName = usePathname()
   const searchQuery = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
   const pushTo = (value: any) => {
      const qu = objToQueryString({ ...queryStringToJSON(searchQuery), ...value })
      router.push(`${pathName}?` + qu)
   }
   // routing =========<<<


   // search params =======>>>
   const page: any = searchParams.get('page') || '1'
   const search_by = searchParams.get('search_by') || "user_name"
   const search = searchParams.get('search') || ''
   const limit: any = searchParams.get('limit') || '5'
   const sort_type = searchParams.get('sort_type') || 'desc'
   const sort_by = searchParams.get('sort_by') || ''
   const sort_key = searchParams.get('sort_key') || ''
   const status: any = searchParams.get('status') || 'active'
   const selected: any = searchParams.get('selected') || 'undefined'
   // search params =======<<<


   const [initialRender, setInitialRender] = useState(true)

   useEffect(() => {
      pushTo({
         page,
         search,
         search_by,
         limit,
         sort_type,
         sort_by,
         status,
         selected
      })
      setInitialRender(true)
   }, [])
   useEffect(() => {
      if (initialRender) {
         services.fetchData({
            page,
            limit,
            search,
            search_by,
            sort_key,
            expand: 'true',
            status,
         })
      }
   }, [page, search_by, search, limit, sort_by, sort_type, status, initialRender])














   return (
      <CustomerContext.Provider value={services}>
         {children}
      </CustomerContext.Provider>
   );
};

export const useCustomerContext = () => {
   const context = useContext(CustomerContext);
   if (!context) {
      throw new Error('useTheme must be used within a OrderProvider');
   }
   return context;
};
