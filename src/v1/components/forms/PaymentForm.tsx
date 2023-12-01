'use client';;
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
   Autocomplete,
   Box,
   Button,
   Container,
   FormControl,
   FormHelperText,
   Grid,
   IconButton,
   InputLabel,
   MenuItem,
   Paper,
   Select,
   TextField,
} from "@mui/material";
import useConfig from "@/v1/hooks/useConfig";
import AsynchronousSelect, { AsyncSelectOptionOption } from "../inputs/asyncSelect";
import moment from "moment";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import * as React from 'react'
import useSelectCustomer from "@/v1/hooks/useSelectCustomer";
import { BANK_LIST } from "@/v1/utils/bankLIst";


export interface PaymentInitialValues {
   customer: AsyncSelectOptionOption | null,
   date: string,
   receipt_no: string,
   received_by: string,
   amount: number,
   payment_mode: string,
   description: string,
   cheque_info?: {
      cheque_date: string;
      bank_name: string | undefined,
      branch_name: string;
      cheque_no: string
   },
}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: PaymentInitialValues
}





const PaymentsForm = ({ submit, initialValues }: Props) => {

   const {
      control,
      setError,
      handleSubmit,
      reset,
      // setValue,

      formState: { errors },
   } = useForm({
      defaultValues: {
         ...initialValues
      },
   });

   const mode = useWatch({ control, name: 'payment_mode' })

   React.useEffect(() => {
      reset(initialValues)
   }, [initialValues])

   const handleError = (data: any) => {
      toast.error(data.message || 'error')
      if (data.data.length) {
         return data.data.forEach((item: any) =>
            setError(item.field, { type: 'custom', message: item.value }),
         );
      }
   }

   const onSubmit = async (formData: any) => {
      try {

         formData.customer = formData.customer.value

         if (mode !== 'Cheque') {
            delete formData.cheque_info
         }
         const { success, errors } = await submit(formData)
         if (!success) {
            handleError(errors)
         } else {
            reset(initialValues)
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

   const handlePlus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).add(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   const handleMinus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).subtract(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   const { userLoadOption, userOptions } = useSelectCustomer('roll=customer')

   return (
      <Container >
         <Paper sx={{ p: 3 }}>
            <Box component='form' noValidate width={'100%'} onSubmit={handleSubmit(onSubmit)}>
               <Grid container spacing={3}>

                  <Grid item xs={12} sm={6}>
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

                           <Box position={'relative'}>
                              <TextField
                                 {...field}
                                 type="date"
                                 error={Boolean(errors.date)}
                                 helperText={errors.date?.message}
                                 label="Date"
                                 size="small"
                                 fullWidth
                              />
                              <Box position={'absolute'} top={7} right={50}>
                                 <IconButton onClick={() => handleMinus(field.value, field.onChange)} color="error" size="small">
                                    <FaMinusCircle />
                                 </IconButton>
                                 <IconButton onClick={() => handlePlus(field.value, field.onChange)} color="primary" size="small">
                                    <FaPlusCircle />
                                 </IconButton>
                              </Box>
                           </Box>
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "this field is required",
                           },
                        }}
                        control={control}
                        name="customer"
                        render={({ field }) => (
                           <AsynchronousSelect
                              label="Select Customer"
                              error={errors.customer ? errors.customer.message : ''}
                              onSelect={field.onChange}
                              loadOption={userLoadOption}
                              options={userOptions}
                              defaultValue={field.value}
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "this field is required",
                           },
                        }}
                        control={control}
                        name="receipt_no"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.receipt_no)}
                              helperText={errors.receipt_no?.message}
                              label="M Receipt No"
                              type="number"
                              size="small"
                              fullWidth
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Controller
                        rules={{
                           required: {
                              value: false,
                              message: "this field is required",
                           },
                        }}
                        control={control}
                        name="received_by"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.received_by)}
                              helperText={errors.received_by?.message}
                              label="Received By"
                              size="small"
                              fullWidth
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "this field is required",
                           },
                        }}
                        control={control}
                        name="description"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.description)}
                              helperText={errors.description?.message}
                              label="Descriptions"
                              size="small"
                              fullWidth
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Controller
                        rules={{
                           required: {
                              value: true,
                              message: "Please Select Currency",
                           },
                        }}
                        control={control}
                        name="payment_mode"
                        render={({ field }) => (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Payment Mode</InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select-cure"
                                 error={Boolean(errors.payment_mode?.message)}
                                 value={config ? field.value : ''}
                                 label="Payment Mode"
                                 name="Payment"
                                 onChange={field.onChange}
                                 size="small"
                              >

                                 {config?.payment_modes.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                 ))}
                              </Select>
                              <FormHelperText>{errors.payment_mode?.message}</FormHelperText>
                           </FormControl>
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                              label="Amount"
                              type="number"
                              size="small"
                              fullWidth
                           />
                        )}
                     />
                  </Grid>
                  {mode == 'Cheque' && <>
                     <Grid item xs={12} sm={6}>
                        <Controller
                           rules={{
                              required: "This field is required",
                           }}
                           control={control}
                           name="cheque_info.bank_name"
                           render={({ field }) => (
                              <Autocomplete
                                 isOptionEqualToValue={() => true}
                                 fullWidth
                                 size="small"
                                 value={field.value}
                                 onChange={(event, newValue) => {
                                    // field.onChange(newValue);
                                 }}
                                 inputValue={field.value}
                                 onInputChange={(event, newInputValue) => {
                                    field.onChange(newInputValue);
                                 }}
                                 renderOption={(props: any, option) => {
                                    const { key, ...otherProps } = props;  // Extract key prop
                                    return (
                                       <li key={option} {...otherProps}>
                                          {option}
                                       </li>
                                    );
                                 }}
                                 onBlur={field.onBlur}  // Pass onBlur for better form validation
                                 id="controllable-states-demo"
                                 options={BANK_LIST.map((item) => item.BankName)}
                                 renderInput={(params) => <TextField {...params} label="Bank Name" />}
                              />

                           )}
                        />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <Controller
                           rules={{
                              required: {
                                 value: true,
                                 message: "this field is required",
                              },
                           }}
                           control={control}
                           name="cheque_info.branch_name"
                           render={({ field }) => (
                              <TextField
                                 {...field}

                                 error={Boolean(errors.cheque_info?.branch_name)}
                                 helperText={errors.cheque_info?.branch_name?.message}
                                 label="Branch Name"
                                 size="small"
                                 fullWidth
                              />
                           )}
                        />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <Controller
                           rules={{
                              required: {
                                 value: true,
                                 message: "this field is required",
                              },
                           }}
                           control={control}
                           name="cheque_info.cheque_date"
                           render={({ field }) => (

                              <Box position={'relative'}>
                                 <TextField
                                    {...field}
                                    type="date"
                                    error={Boolean(errors.cheque_info?.cheque_date)}
                                    helperText={errors.cheque_info?.cheque_date?.message}
                                    label="Cheque Date"
                                    size="small"
                                    fullWidth
                                 />
                                 <Box position={'absolute'} top={7} right={50}>
                                    <IconButton onClick={() => handleMinus(field.value, field.onChange)} color="error" size="small">
                                       <FaMinusCircle />
                                    </IconButton>
                                    <IconButton onClick={() => handlePlus(field.value, field.onChange)} color="primary" size="small">
                                       <FaPlusCircle />
                                    </IconButton>
                                 </Box>
                              </Box>
                           )}
                        />
                     </Grid>
                     <Grid item sm={6} xs={12}>
                        <Controller
                           rules={{
                              required: {
                                 value: true,
                                 message: "this field is required",
                              },
                           }}
                           control={control}
                           name="cheque_info.cheque_no"
                           render={({ field }) => (
                              <TextField
                                 {...field}
                                 error={Boolean(errors.cheque_info?.cheque_no)}
                                 helperText={errors.cheque_info?.cheque_no?.message}
                                 label="Cheque No"
                                 size="small"
                                 fullWidth
                              />
                           )}
                        />
                     </Grid>
                  </>}
               </Grid>
               <Box width={'100%'} display={'flex'}>
                  <Button sx={{ mt: 2, ml: 'auto' }} type="submit" variant="contained" >Save</Button>
               </Box>
            </Box>
         </Paper>
      </Container>
   )
}


export default PaymentsForm