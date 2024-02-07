import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { objToQueryString, queryStringToJSON } from '../utils/queryString';

export default function useSearchParamsHook() {
   const router = useRouter()
   const pathName = usePathname()
   const searchQuery = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
   const pushQuery = (value: any) => {
      const qu = objToQueryString({ ...queryStringToJSON(searchQuery), ...value })
      router.push(`${pathName}?` + qu)
   }

   return { pushQuery }
}
