import { Box, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

export default function DateInput({ value, onChange, error }: { value: string, onChange: (arg: string) => void, error?: string }) {

   const handlePlus = () => {
      const newDate = moment(`${value}`).add(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   const handleMinus = () => {
      const newDate = moment(`${value}`).subtract(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
         <Box position={'relative'}>
            <DatePicker label="Date"
               minDate={moment('2022-01-01')}
               maxDate={moment().add(3, 'month')}

               slotProps={{
                  textField: { size: 'small', fullWidth: true, error: Boolean(error), helperText: error },
                  actionBar: {
                     actions: ['today', 'cancel', 'accept'],
                  },
               }}
               value={moment(value)}
               onChange={(value) => onChange(value?.toISOString() || '')}
            />
            <Box position={'absolute'} top={7} right={50} >
               <IconButton sx={{ marginRight: 1 }} onClick={handleMinus} color="error" size="small">
                  <FaMinusCircle />
               </IconButton>
               <IconButton onClick={handlePlus} color="primary" size="small">
                  <FaPlusCircle />
               </IconButton>
            </Box>

         </Box>
      </LocalizationProvider>
   )
}
