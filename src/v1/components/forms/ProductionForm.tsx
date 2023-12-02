'use client';;
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
   Box,
   Button,
   FormControl,
   FormHelperText,
   Grid,
   IconButton,
   InputBase,
   InputLabel,
   MenuItem,
   Paper,
   Select,
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
import useConfig from "@/v1/hooks/useConfig";
import moment from "moment";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import useSelectOrder from "@/v1/hooks/useSelectOrder";

import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { OrderExpand } from "@/v1/utils/Types";

interface ProductionData {
   order: AsyncSelectOptionOption | undefined;
   qty: number;
   machine_no: number;
   operator: AsyncSelectOptionOption | undefined;
   helper: string;
   remarks: string;
}


export interface ProductionInitialValue {
   date: string;
   shift: string;
   total_amount: number;
   production_data: ProductionData[];
   remarks: string;
}


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: ProductionInitialValue
}

const ProductionForm = ({ submit, initialValues }: Props) => {

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
      name: "production_data"
   });

   const watch = useWatch({ control, name: 'production_data' })

   const handleAppend = () => {
      append({
         machine_no: +watch[watch.length - 1]?.machine_no + 1,
         order: undefined,
         qty: 0,
         operator: undefined,
         helper: "",
         remarks: "",
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
   const [total_amount, setTotalAmount] = useState(0);
   useEffect(() => {
      const amount = watch.reduce((acc, obj) => {
         if (obj.order) {
            const order: OrderExpand = obj.order.value
            const rate = order?.currency == 'BDT' ? order.rate : (+order?.customer?.exchange_rate * order.rate / 12)

            const res = +acc + Number(obj.qty * rate)
            return res
         } else {
            return 0
         }
      }, 0)
      setValue('total_amount', amount)
      setTotalAmount(amount)
   }, [watch]);



   useEffect(() => {
      if (initialValues.production_data.length) {
         reset(initialValues)
      }

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

         const items = formData.production_data.map((c: any) => {
            return {
               ...c,
               order: c.order.value._id,
               operator: c.operator.value,

            }
         })
         formData.production_data = items

         const { success, errors } = await submit(formData)
         if (!success) {
            handleError(errors)
         } else {

            if (formData.shift == 'Night Shift') {
               const nextDay = moment(formData.date).add(1, 'day').format('yy-MM-DD')
               setValue('date', nextDay)
            }
            setValue('shift', formData.shift == 'Day Shift' ? 'Night Shift' : 'Day Shift')
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

   const handlePlus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).add(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   const handleMinus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).subtract(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }


   const calculateAmount = (index: number) => {
      const order: OrderExpand = watch?.[index]?.order?.value
      if (!order) {
         return 0
      }
      const exchange_rate = +order?.customer?.exchange_rate || 85
      const rate = order?.currency == 'BDT' ? order.rate : (exchange_rate * order.rate / 12)

      const amm = `${(rate * +watch?.[index]?.qty)?.toFixed(2)}`
      return amm
   }






   const { config } = useConfig()
   const { orderLoadOption, orderOptions } = useSelectOrder()
   const { userLoadOption, userOptions } = useSelectCustomer('roll=employee')

   return (
      <Paper sx={{ p: 3, maxWidth: '1300px', mx: 'auto' }}>
         <Box component='form' noValidate id="production-form" width={'100%'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6}>
                  <Controller
                     rules={{
                        required: {
                           value: true,
                           message: "Please enter Date",
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
                           message: "Please Select Shift",
                        },
                     }}
                     control={control}
                     name="shift"
                     render={({ field }) => (
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-label-shift">Shift</InputLabel>
                           <Select
                              labelId="demo-simple-select-label-shift"
                              id="demo-simple-select-label-shift"
                              error={Boolean(errors.shift?.message)}
                              value={config?.shifts ? field.value : ""}
                              label="Shift"
                              onChange={field.onChange}
                              size="small"
                              name="shift"
                           >
                              <MenuItem value={''}>{'Select'}</MenuItem>

                              {config?.shifts.map((item: string) => (
                                 <MenuItem key={item} value={item}>{item}</MenuItem>
                              ))}

                           </Select>
                           <FormHelperText>{errors.shift?.message}</FormHelperText>
                        </FormControl>
                     )}
                  />
               </Grid>


               <Grid item sm={12} >
                  <Box minWidth={1000} overflow={'auto'}>
                     <Table size="small"  >
                        <TableHead>
                           <TableRow >
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '8%' }} >M-N</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '32%' }}>Order</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Qty</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '8%' }}>Rate</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Amount</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '15%' }}>Op</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Remarks</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '10%' }}>Action</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {fields.map((item, index) => (
                              <TableRow key={item.id}>
                                 <TableCell sx={{ border: 1, borderColor: errors?.production_data?.[index]?.machine_no?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please Enter Machine NO",
                                          },
                                       }}
                                       control={control}
                                       name={`production_data.${index}.machine_no`}
                                       render={({ field }) => (
                                          <InputBase type="number" {...field} />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.production_data?.[index]?.order?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please Select an order",
                                          },
                                       }}
                                       control={control}
                                       name={`production_data.${index}.order`}
                                       render={({ field }) => (
                                          <AsynchronousSelect
                                             sx={{
                                                '& fieldset': {
                                                   border: 'none'
                                                },
                                             }}
                                             label=""
                                             error={errors?.production_data?.[index]?.order?.message}
                                             onSelect={field.onChange}
                                             loadOption={orderLoadOption}
                                             options={orderOptions.filter((item)=>item.value.status !== 'Invoiced')}
                                             defaultValue={field.value}
                                          />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.production_data?.[index]?.qty?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please enter qty",
                                          },
                                       }}
                                       control={control}
                                       name={`production_data.${index}.qty`}
                                       render={({ field }) => (
                                          <InputBase {...field} type="number" />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>
                                    {watch[index]?.order?.value?.currency}   {+watch[index]?.order?.value?.rate?.toFixed(2)}
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: "darkgrey" }}>{calculateAmount(index)}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>
                                    <Controller
                                       rules={{
                                          required: {
                                             value: true,
                                             message: "Please Select an Operator",
                                          },
                                       }}
                                       control={control}
                                       name={`production_data.${index}.operator`}
                                       render={({ field }) => (
                                          <AsynchronousSelect
                                             sx={{
                                                '& fieldset': {
                                                   border: 'none'
                                                },
                                             }}
                                             label=""
                                             error={errors?.production_data?.[index]?.operator?.message}
                                             onSelect={field.onChange}
                                             loadOption={userLoadOption}
                                             options={userOptions}
                                             defaultValue={field?.value}
                                          />
                                       )}
                                    />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: errors?.production_data?.[index]?.remarks?.message ? 'red' : 'darkgrey' }} >
                                    <Controller
                                       rules={{
                                          required: {
                                             value: false,
                                             message: "Please enter Remarks",
                                          },
                                       }}
                                       control={control}
                                       name={`production_data.${index}.remarks`}
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
         <Typography color={errors.total_amount?.message ? 'red' : undefined}>Total =  {total_amount.toFixed(2)}</Typography>
      </Paper>

   )
}


export default ProductionForm