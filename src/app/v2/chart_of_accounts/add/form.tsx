'use client';
import { Axios } from '@/v1/utils/axios-config';
import {
   Box,
   Button,
   Checkbox,
   FormControl,
   FormControlLabel,
   FormHelperText,
   Grid,
   InputLabel,
   MenuItem,
   Paper,
   Select,
   Stack,
   TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useConfig from '@/v1/hooks/useConfig';

type InitialValue = {
   account_type: string,
   account_name: string,
   is_debit: boolean,
   description: string,
}

export default function AccountForm() {

   const {
      control,
      setError,
      handleSubmit,
      reset,
      // setValue,

      formState: { errors },
   } = useForm<InitialValue>({
      defaultValues: {
         account_type: "Asset"


      },
   });


   const [state, setState] = useState({
      expenseAccount: [],
      assetAccount: []
   })

   const fetchAccounts = async () => {
      try {
         const { data } = await Axios.get(`/api/v2/accounts?limit=100`)
         const expenseAccount = data.data.filter((item: any) => item.account_type == 'Expense').map((item: any) => ({ label: item.account_name, value: item._id }))
         const assetAccount = data.data.filter((item: any) => item.account_type == 'Asset').map((item: any) => ({ label: item.account_name, value: item._id }))
         setState((prev) => ({ ...prev, expenseAccount, assetAccount }))
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      fetchAccounts()
   }, [])

   const handleError = (data: any) => {
      console.log(data)
      toast.error(data.message || 'error')
      if (data?.data?.length) {
         return data.data.forEach((item: any) =>
            setError(item.field, { type: 'custom', message: item.value }),
         );
      }
   }

   const onSubmit = async (formData: InitialValue) => {
      try {
         const { data } = await toast.promise(
            Axios.post('/api/v2/accounts', formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );

         if (data.code === 400) {
            handleError(data)

         } else if (data.code === 200 || data.code === 201) {
            
            toast.success(`Successfully save order - ${data.data.order_name}`);
         }

      } catch (error: any) {
         if (error.response) {
            const { data } = error.response;
            handleError(data)
         } else {
            toast.error('error')
            console.log(error)
         }
      }
   }

   const { config } = useConfig()


   return (
      <Box mt={2} component={Paper} p={5}>
         <Box component='form' noValidate width={'100%'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container >
               <Grid item sm={6} xs={12}>
                  <Stack spacing={3}>
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Select Currency",
                           },
                        }}
                        control={control}
                        name="account_type"
                        render={({ field }) => (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Account Type *</InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select-cure"
                                 error={Boolean(errors.account_type)}
                                 value={config ? field.value : ''}
                                 label="Account Type *"
                                 name="Payment"
                                 onChange={field.onChange}
                                 size="small"
                              >

                                 {config?.account_type?.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                 ))}
                              </Select>
                              <FormHelperText>{errors.account_type?.message}</FormHelperText>
                           </FormControl>
                        )}
                     />

                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "this field is required",
                           },
                        }}
                        control={control}
                        name="account_name"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.account_name)}
                              helperText={errors.account_name?.message}
                              label="Account Name *"
                              size="small"
                              fullWidth
                           />
                        )}
                     />

                     <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.description)}
                              helperText={errors.description?.message}
                              label="Descriptions"
                              size="medium"
                              fullWidth
                           />
                        )}
                     />

                     <Box>
                        <Controller
                           control={control}
                           name="is_debit"
                           render={({ field }) => (
                              <FormControlLabel control={
                                 <Checkbox
                                    inputProps={{ "aria-label": 'is Debitable' }}
                                    defaultChecked={field.value}
                                    value={field.value}
                                    onClick={() => field.onChange((x: boolean) => !x)} />
                              } label="is Debitable" />

                           )}
                        />
                     </Box>


                     <Box >
                        <Button sx={{ mr: 2 }} type='submit' size='small' variant='contained' color='success'>Submit</Button>
                        <Button onClick={() => reset({})} size='small' variant='contained' color='error'>Reset</Button>
                     </Box>

                  </Stack>

               </Grid>
               <Grid item sm={6} xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
               </Grid>
            </Grid>
         </Box>
      </Box>

   )
}
