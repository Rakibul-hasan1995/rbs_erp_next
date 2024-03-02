'use client';;
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
   Box,
   Button,
   Grid,
   IconButton,
   InputBase,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TextField,
   Typography,
} from "@mui/material";
import useSelectCustomer from "@/v1/hooks/useSelectCustomer";
import AsynchronousSelect, { AsyncSelectOptionOption } from "@/v1/components/inputs/asyncSelect";
import { useEffect, useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { _arrSum } from "@/v1/utils/arrSum";
import { Axios } from "@/v1/utils/axios-config";
import DateInput from "../inputs/dateInput";

interface ChallanItem {
   order: any;
   qty: number;
   emb_reject_qty: number;
   fabric_reject_qty: number;
   remarks: string;
}

export interface ChallanInitialValues {
   date: string;
   customer: any;
   challan_no: number;
   bag_qty: number;
   items: ChallanItem[];
   remarks: string;
}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: ChallanInitialValues
}

const ChallanForm = ({ submit, initialValues }: Props) => {
   const {
      control,
      setError,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm({
      defaultValues: {
         ...initialValues
      },
   });




   const { fields, append, remove } = useFieldArray({
      control,
      name: "items"
   });

   const watch = useWatch({ control, name: 'items' })
   const selectedCustomer = useWatch({ control, name: 'customer' })

   const handleAppend = () => {
      append({
         order: undefined,
         qty: 0,
         emb_reject_qty: 0,
         fabric_reject_qty: 0,
         remarks: '',

      })
   }

   const handleKeyPress = (event: any) => {
      if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
         event.preventDefault();
         handleAppend()
      }
      if (event.ctrlKey && (event.key === '-' || event.key === '-')) {
         event.preventDefault();
         const index = watch.length - 1
         if (index == 0) {
            return
         } else {
            remove(index)
         }
      }

      // else if (event.ctrlKey && (event.key === '-' || event.key === '=')) {
      //    event.preventDefault();
      //    console.log('Ctrl and + were pressed together.');
      // }
   };

   useEffect(() => {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
         document.removeEventListener('keydown', handleKeyPress);
      };
   }, [watch]);
   const [total_qty, setTotalQty] = useState(0);

   useEffect(() => {
      const qty = _arrSum(watch, 'qty')
      setTotalQty(+qty)
   }, [watch]);



   useEffect(() => {
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

         const items = formData.items.map((c: any) => {
            return {
               ...c,
               order: c.order.value._id,
            }
         })

         formData.items = items
         formData.customer = formData.customer.value

         const { success, errors } = await submit(formData)
         if (!success) {
            handleError(errors)
         } else {
            setValue('challan_no', +formData.challan_no + 1)
            // if (formData.shift == 'Night Shift') {
            //    const nextDay = moment(formData.date).add(1, 'day').format('yy-MM-DD')
            //    setValue('date', nextDay)
            // }
            // setValue('cha', formData.shift == 'Day Shift' ? 'Night Shift' : 'Day Shift')
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

   const [orderOptions, setOptions] = useState<AsyncSelectOptionOption[]>([]);

   useEffect(() => {
      const label: string = selectedCustomer?.label
      if (label) {
         const lt = label.split(' ')
         orderLoadOption(lt[0])
      }
   }, [selectedCustomer])

   const orderLoadOption = async (searchValue: string) => {
      try {

         if (searchValue.length < 1 || searchValue.length > 40) {
            return
         }

         const { data } = await Axios.get(
            `/api/v1/orders?expand=true&limit=20&expand=false&filter_key=status&filter_value=Invoiced${searchValue ? `&search=${searchValue}&search_by=customer.user_name` : ''}`

         );

         const items: AsyncSelectOptionOption[] = data.data?.filter((item: any) => item.customer._id == selectedCustomer.value).map((item: any) => ({
            // const items: AsyncSelectOptionOption[] = data.data?.filter((item: Order) => item.status !== 'Invoiced')?.map((item: any) => ({
            label: `${item.program_name} ${item.order_name} (${item.status[0]})`,
            value: item,
            avatar: item.cover_photo.href,
         }));
         setOptions(items);
      } catch (error) {
         console.error('Error fetching options:', error);
      }
   };




   const { userLoadOption, userOptions } = useSelectCustomer('')

   return (
      <Paper sx={{ p: 3, maxWidth: '1300px', mx: 'auto' }}>
         <Box component='form' noValidate id="production-form" width={'100%'} onSubmit={handleSubmit(onSubmit)}>
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
                        <DateInput value={field.value} onChange={field.onChange} error={errors.date?.message} />
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
                     name="challan_no"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           error={Boolean(errors.challan_no)}
                           helperText={errors.challan_no?.message}
                           label="Challan No"
                           size="small"
                           fullWidth
                           type="number"
                        />
                     )}
                  />
               </Grid>
               <Grid item sm={12}>
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please enter Date",
                        },
                     }}
                     control={control}
                     name="customer"
                     render={({ field }) => (
                        <AsynchronousSelect
                           label="Select Customer"
                           error={errors.customer?.message}
                           onSelect={field.onChange}
                           loadOption={userLoadOption}
                           options={userOptions}
                           defaultValue={field?.value}

                        />
                     )}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Controller
                     control={control}
                     name="remarks"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           error={Boolean(errors.remarks)}
                           helperText={errors.remarks?.message}
                           label="Remarks"
                           size="small"
                           fullWidth
                        />
                     )}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Controller
                     control={control}
                     name="bag_qty"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           error={Boolean(errors.bag_qty)}
                           helperText={errors.bag_qty?.message}
                           label="Bag Qty"
                           type="number"
                           size="small"
                           fullWidth
                        />
                     )}
                  />
               </Grid>
               <Grid item sm={12} >
                  <Box minWidth={1000} overflow={'auto'}>
                     <Table size="small"  >
                        <TableHead>
                           <TableRow >
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '32%' }}>Order</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Qty</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>E.R</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>F.R</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Remarks</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Action</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {fields.map((item, index) => (
                              <TableRow key={item.id}>
                                 <TableCell sx={{ border: 1, borderColor: errors?.items?.[index]?.order?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please Select an order",
                                          },
                                       }}
                                       control={control}
                                       name={`items.${index}.order`}
                                       render={({ field }) => (
                                          <>
                                             {selectedCustomer && <AsynchronousSelect
                                                sx={{
                                                   '& fieldset': {
                                                      border: 'none'
                                                   },
                                                }}
                                                label=""
                                                error={errors?.items?.[index]?.order?.message}
                                                onSelect={field.onChange}
                                                loadOption={orderLoadOption}
                                                options={orderOptions}
                                                defaultValue={field.value}
                                             />}
                                          </>
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.items?.[index]?.qty?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please enter qty",
                                          },
                                       }}
                                       control={control}
                                       name={`items.${index}.qty`}
                                       render={({ field }) => (
                                          <InputBase {...field} type="number" />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.items?.[index]?.emb_reject_qty?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: false,
                                             message: "Please enter qty",
                                          },
                                       }}
                                       control={control}
                                       name={`items.${index}.emb_reject_qty`}
                                       render={({ field }) => (
                                          <InputBase {...field} type="number" />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.items?.[index]?.fabric_reject_qty?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: false,
                                             message: "Please enter qty",
                                          },
                                       }}
                                       control={control}
                                       name={`items.${index}.fabric_reject_qty`}
                                       render={({ field }) => (
                                          <InputBase {...field} type="number" />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.items?.[index]?.remarks?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: false,
                                             message: "Please enter Remarks",
                                          },
                                       }}
                                       control={control}
                                       name={`items.${index}.remarks`}
                                       render={({ field }) => (
                                          <InputBase {...field} />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                       {fields.length - 1 == index &&
                                          <IconButton color="primary" onClick={handleAppend}>
                                             <AiFillPlusCircle />
                                          </IconButton>
                                       }
                                       {fields.length !== 1 &&
                                          <IconButton color="error" onClick={() => remove(index)}>
                                             <AiFillMinusCircle />
                                          </IconButton>
                                       }
                                    </Box>


                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Box>
               </Grid>

            </Grid>
            <Box width={'100%'} display={'flex'}>
               <Button sx={{ mt: 2, ml: 'auto' }} type="submit" variant="contained" >Save</Button>
            </Box>
         </Box>
         <Typography >Total =  {total_qty} Pcs</Typography>
      </Paper>

   )
}


export default ChallanForm