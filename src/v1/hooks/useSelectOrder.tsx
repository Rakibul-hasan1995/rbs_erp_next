
import * as React from 'react'
import { AsyncSelectOptionOption } from '../components/inputs/asyncSelect';
import { Axios } from '../utils/axios-config';

export default function useSelectOrder() {

   const [orderOptions, setOptions] = React.useState<AsyncSelectOptionOption[]>([]);

   React.useEffect(() => {
      orderLoadOption('  ')
   }, [])

   const orderLoadOption = async (searchValue: string) => {
      try {
         if (searchValue.length < 1 || searchValue.length > 8) {
            return
         }
         const { data } = await Axios.get(
            `/api/v1/orders?filter_key=status&filter_value=Invoiced&expand=true&limit=10${searchValue ? `&search=${searchValue}` : ''}`
         );
         const items: AsyncSelectOptionOption[] = data.data.map((item: any) => ({
            label: `${item.program_name} ${item.order_name} (${item.status[0]})`,
            value: item,
            avatar: item.cover_photo.href,

         }));

         setOptions(items);
      } catch (error) {
         console.error('Error fetching options:', error);
      }
   };



   return { orderLoadOption, orderOptions }
}
