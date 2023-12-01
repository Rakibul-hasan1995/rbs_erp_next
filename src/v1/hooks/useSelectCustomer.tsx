
import * as React from 'react'
import { AsyncSelectOptionOption } from '../components/inputs/asyncSelect';
import { Axios } from '../utils/axios-config';

export default function useSelectUser(arg = 'roll=customer') {

   const [userOptions, setOptions] = React.useState<AsyncSelectOptionOption[]>([]);


   React.useEffect(() => {
      userLoadOption('  ')
   }, [])
   const userLoadOption = async (searchValue: string) => {


      try {
         if (searchValue.length < 1 || searchValue.length > 8) {
            return
         }
         const { data } = await Axios.get(
            `/api/v1/users?limit=10${`&${arg}`}${searchValue ? `&search_by=user_name&search=${searchValue}` : ''}`
         );
         const items: AsyncSelectOptionOption[] = data.data.map((item: any) => ({
            label: item.user_name,
            value: item._id,
            // avatar: 'https://res.cloudinary.com/dbu76a0wo/image/upload/v1694582998/du3mvkmrohhrmjyxkpab.png',
         }));

         setOptions(items);
      } catch (error) {
         console.error('Error fetching options:', error);
      }
   };

   return { userLoadOption, userOptions }
}
