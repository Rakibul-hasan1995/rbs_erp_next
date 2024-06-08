
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast"
import { Axios } from "../../utils/axios-config"
import moment from "moment"
import { OrderExpand } from "@/v1/utils/Types";
import {
   Box,
   Button,
   FormControl,
   Grid,
   IconButton,
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
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import AsynchronousSelect, { AsyncSelectOptionOption } from "../inputs/asyncSelect";
import Image from "next/image";
import { numberWithCommas } from "@/v1/utils/numberFormater";



export interface InvoiceInitialValues {
   date: string;
   customer: AsyncSelectOptionOption | undefined;
   discount: number;
   items: OrderExpand[];
   cover_photo: string;
   remarks: string;
}


interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: InvoiceInitialValues
}

const InvoiceForm = ({ submit, initialValues }: Props) => {

   const [orders, setOrders] = useState<OrderExpand[]>([])

   const fetchOrders = async (id: string) => {
      try {
         const { data } = await Axios.get(`/api/v1/users/${id}/orders?limit=50&search_by=status&search=Shipped`)
         setOrders(data.data)
        
      } catch (error) {
         console.log(error)
      }
   }

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
   const { fields, append, remove } = useFieldArray({
      control,
      name: "items"
   });



   useEffect(() => {
      reset(initialValues)
   }, [initialValues])


   const selectedCustomer = useWatch({ control, name: 'customer' })
   useEffect(() => {
      if (selectedCustomer) {
         fetchOrders(selectedCustomer.value)
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedCustomer])

   const handlePlus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).add(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }
   const handleMinus = (value: string, onChange: (arg: any) => void) => {
      const newDate = moment(`${value}`).subtract(1, 'day').format('yy-MM-DD')
      onChange(newDate)
   }

   const handleError = (data: any) => {
      toast.error(data.message || 'error')
      console.log(data)
      if (data?.data?.length) {
         return data.data.forEach((item: any) =>
            setError(item.field, { type: 'custom', message: item.value }),
         );
      }
   }




   const handleSelectOrder = (e: any) => {
      const orderId = e.target.value
      const find = orders.find((item) => item._id == orderId)
      if (find) {
         append(find)
      }
      const filter = orders.filter((item) => item._id !== orderId)
      setOrders(filter)
   }



   const onSubmit = async (formData: any) => {
      try {

         formData.items = fields.map((item) => item._id)
         formData.cover_photo = fields?.[0].cover_photo._id
         formData.customer = formData.customer.value

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
   
   const { userLoadOption, userOptions } = useSelectCustomer('roll=customer')

   const calculateTotalUsd = (order: OrderExpand) => {
      const { qty, rate, currency } = order
      if (currency == 'USD') {
         const amount = qty / 12 * rate
         return numberWithCommas(amount)
      } else {
         return '--'
      }
   }

   const calculateTotalBDT = (order: OrderExpand) => {
      const { qty, rate, currency } = order
      const exchange_rate = +order?.customer?.exchange_rate || 85
      if (currency == 'USD') {
         const amount = ((qty / 12) * rate) * exchange_rate
         return numberWithCommas(amount)
      } else {
         return numberWithCommas((qty * rate))
      }
   }


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
                           message: "Please enter Date",
                        },
                     }}
                     control={control}
                     name="discount"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           type="number"
                           error={Boolean(errors.discount)}
                           helperText={errors.discount?.message}
                           label="Discount"
                           size="small"
                           fullWidth
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
                     rules={{
                        required: {
                           value: false,
                           message: "Please enter Remarks",
                        },
                     }}
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
                  <FormControl fullWidth>
                     <InputLabel id="demo-simple-select-label-shift">Select Orders</InputLabel>
                     <Select
                        labelId="demo-simple-select-label-shift"
                        id="demo-simple-select-label-shift"
                        disabled={orders.length == 0}
                        value={''}
                        label="Select Orders"
                        onChange={handleSelectOrder}
                        size="small"
                        name="shift"

                     >
                        {orders.map((item) => (
                           <MenuItem key={item._id} value={item._id}>
                              <Box display={'flex'} gap={3} py={1} justifyContent={'center'}>
                                 <Image src={item.cover_photo.href} width={40} height={28} alt={item.order_name} />
                                 <Typography>{item.program_name} {item.order_name}</Typography>
                              </Box>
                           </MenuItem>
                        ))}
                        {!orders.length && <MenuItem hidden disabled value={''}>{'Select'}</MenuItem>}
                     </Select>

                  </FormControl>
               </Grid>
               <Grid item sm={12} >
                  <Box minWidth={1000} overflow={'auto'}>
                     <Table size="small"  >
                        <TableHead>
                           <TableRow >
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }} >Order</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>Design</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>Qty</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>Rate</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>T.USD</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>Amount</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>Action</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {fields.map((item, index) => (
                              <TableRow key={item.id}>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', }} >{item.program_name} {item.order_name}</TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}><Image src={item.cover_photo.href} height={40} width={55} alt={item._id} /></TableCell>
                                 <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', }}>{item.qty}</TableCell>
                                 <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', }}>{item.currency} {numberWithCommas(item.rate)}</TableCell>
                                 <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', }}>{calculateTotalUsd(item)}</TableCell>
                                 <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', }}>{calculateTotalBDT(item)}</TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', }}>
                                    <IconButton color="error" onClick={() => remove(index)}>
                                       <FaMinusCircle />
                                    </IconButton>
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
         {/* <Typography color={errors.total_amount?.message ? 'red' : undefined}>Total =  {total_amount.toFixed(2)}</Typography> */}
      </Paper>
   )
}
export default InvoiceForm