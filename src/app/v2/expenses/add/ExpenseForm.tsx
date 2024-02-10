'use client'
import AsynchronousSelect, { AsyncSelectOptionOption } from '@/v1/components/inputs/asyncSelect';
import DateInput from '@/v1/components/inputs/dateInput';
import useSelectUser from '@/v1/hooks/useSelectCustomer';
import { Axios } from '@/v1/utils/axios-config';
import { Box, Button, ButtonBase, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RiImageAddFill } from 'react-icons/ri';
import useUploadExpenseFile from './useUploadFile';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useThemeContext } from '@/v1/context/themeContext';

type InitialValue = {
   date: string,
   paid_from_account: AsyncSelectOptionOption | null;
   paid_to_account: AsyncSelectOptionOption | null;
   amount: number,
   type?: 'Opening Balance' | 'Settlement' | 'Expense' | "Income" | 'Invoice' | 'Customer Payment' | 'Purchases' | '';
   customer_id?: AsyncSelectOptionOption | null;
   supplier_id?: AsyncSelectOptionOption | null;
   description?: string,
   status?: string;
   reference?: string;
   image?: string;
}

export default function ExpenseForm({ initialValues, submit }: { initialValues?: InitialValue, submit: any }) {
   const {
      control,
      setError,
      handleSubmit,
      reset,
      setValue,

      formState: { errors },
   } = useForm<InitialValue>({
      defaultValues: {
         date: moment().format('yyyy-MM-DD'),
         amount: 0,
         reference: '',
         description: ''
      },
   });
   const image = useWatch({ control, name: 'image' })

   useEffect(() => {
      if (initialValues) {
         reset({ ...initialValues })
      }
   }, [])



   const [state, setState] = useState({
      expenseAccount: [],
      assetAccount: []
   })

   const { setTitle } = useThemeContext()

   useEffect(() => {
      setTitle("Create Expenses")

      return () => {
         setTitle("RBS")
      }
   }, [])
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

   const { userLoadOption, userOptions } = useSelectUser('roll=supplier')

   const { handleDrop, handleFileChange, imgUrl } = useUploadExpenseFile()
   let inputRef: any


   const handleError = (data: any) => {
      console.log(data.errors)
      toast.error(data.message || 'error')
      if (data?.errors?.length) {
         return data.errors.forEach((item: any) =>
            setError(item.field, { type: 'custom', message: item.value }),
         );
      }
   }

   const onSubmit = async (formData: InitialValue) => {
      try {
         inputRef?.focus()
         formData.paid_from_account = formData.paid_from_account?.value
         formData.paid_to_account = formData.paid_to_account?.value
         formData.customer_id = formData.customer_id?.value
         formData.supplier_id = formData.supplier_id?.value
         formData.type = 'Expense'


         const { success, errors } = await submit(formData)
         if (!success) {
            handleError(errors)
         } else {
            // reset(initialValues)
            setValue('amount', 0)
            setValue('reference',"")

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




   return (
      <Container >
         <Box mt={2} component={Paper} p={5}>
            <Box component='form' noValidate width={'100%'} onSubmit={handleSubmit(onSubmit)}>
               <Grid container >
                  <Grid item sm={6} xs={12}>
                     <Stack spacing={3}>
                        <Controller
                           rules={{
                              required: {
                                 value: true,
                                 message: "this field is required",
                              },
                           }}
                           control={control}
                           name="date"
                           render={({ field }) => (
                              <DateInput value={field.value} onChange={field.onChange} error={errors.date?.message} />
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
                           name="paid_to_account"
                           render={({ field }) => (
                              <AsynchronousSelect
                                 inputRef={(input) => {
                                    inputRef = input
                                 }}

                                 autoFocus={true}
                                 label="Expanse Account *"
                                 error={errors.paid_to_account ? errors.paid_to_account.message : ''}
                                 onSelect={field.onChange}
                                 // loadOption={fetchExpenseAccounts}
                                 loadOption={() => { }}
                                 options={state.expenseAccount}
                                 defaultValue={field.value}
                              />
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
                           name="amount"
                           render={({ field }) => (
                              <TextField
                                 {...field}
                                 error={Boolean(errors.amount)}
                                 helperText={errors.amount?.message}
                                 label="Amount *"
                                 type="number"
                                 size="small"
                                 fullWidth
                              />
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
                           name="paid_from_account"
                           render={({ field }) => (
                              <AsynchronousSelect
                                 label="Paid Through *"
                                 error={errors.paid_from_account ? errors.paid_from_account.message : ''}
                                 onSelect={field.onChange}
                                 // loadOption={fetchExpenseAccounts}
                                 loadOption={() => { }}
                                 options={state.assetAccount}
                                 defaultValue={field.value}
                              />
                           )}
                        />
                        <Controller
                           control={control}
                           name="supplier_id"
                           render={({ field }) => (
                              <AsynchronousSelect
                                 label="Supplier"
                                 error={errors.supplier_id ? errors.supplier_id.message : ''}
                                 onSelect={field.onChange}
                                 loadOption={userLoadOption}
                                 options={userOptions}
                                 defaultValue={field.value}
                              />
                           )}
                        />
                        <Controller
                           control={control}
                           name="reference"
                           render={({ field }) => (
                              <TextField
                                 {...field}
                                 label="Reference"
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
                                 label="Descriptions"
                                 size="small"
                                 fullWidth
                              />
                           )}
                        />
                        <Box >
                           <Button sx={{ mr: 2 }} type='submit' size='small' variant='contained' color='success'>Submit</Button>
                           <Button onClick={() => reset({ paid_from_account: null, paid_to_account: null })} size='small' variant='contained' color='error'>Reset</Button>
                        </Box>

                     </Stack>

                  </Grid>
                  <Grid item sm={6} xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                     <Box borderRadius={2}
                        component={ButtonBase}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        boxShadow={5} px={3} py={8} display={'flex'} flexDirection={'row'}>
                        {imgUrl || image ?
                           <Image src={imgUrl || `${image}`} width={150} height={150} alt='h' />
                           :
                           <Box>
                              <Box textAlign={"center"} >
                                 <Typography color={'Highlight'} fontSize={40}> <RiImageAddFill /></Typography>
                              </Box>
                              <Typography>Drag or Drop Your Receipts</Typography>
                              <Typography variant='caption'>Maximum file size allowed is 1MB</Typography>
                              <Stack mt={3}>

                                 <Button startIcon={<MdOutlineFileUpload />}
                                    component="label" size={'small'} color="secondary"
                                    variant='contained'

                                 >
                                    Upload Your File
                                    <input
                                       type="file"
                                       hidden
                                       onChange={handleFileChange}
                                    />
                                 </Button>
                              </Stack>
                           </Box>}
                     </Box>

                  </Grid>
               </Grid>
            </Box>
         </Box>
      </Container>
   )
}
