
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
   Box,
   Button,
   Container,
   FormControl,
   FormHelperText,
   Grid,
   InputLabel,
   MenuItem,
   Paper,
   Select,
   TextField,
} from "@mui/material";
import useSelectCustomer from "@/v1/hooks/useSelectCustomer";
import AsynchronousSelect, { AsyncSelectOptionOption } from "@/v1/components/inputs/asyncSelect";
import { useEffect } from "react";
import useConfig from "@/v1/hooks/useConfig";
import useSelectOrder from "@/v1/hooks/useSelectOrder";


export interface PurchaseOrderInitialValues {
   order_date: string,
   shipment_date: string,
   supplier: AsyncSelectOptionOption | null,
   order: AsyncSelectOptionOption | null,
   qty: string,
   rate: string,
   status: string,
   description: string,

}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: PurchaseOrderInitialValues
}


const PurchaseOrderForm = ({ submit, initialValues }: Props) => {

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
   const order = useWatch({ control, name: 'order' })

   useEffect(() => {
      if (order) {
         setValue('qty', order.value.qty)
         setValue('rate', order.value.rate)
      }
   }, [order])
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
         formData.supplier = formData.supplier.value
         formData.order = formData.order.value._id
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
   const { orderLoadOption, orderOptions } = useSelectOrder()

   const { userLoadOption, userOptions } = useSelectCustomer('roll=supplier')
   const { config } = useConfig()


   return (
      <Container >
         <Box sx={{ height: `calc(100vh - 96px)`, display: 'flex' }}>
            <Paper sx={{ p: 3, my: 'auto' }}>
               <Box component='form' noValidate width={'100%'} onSubmit={handleSubmit(onSubmit)}>
                  <Grid container>

                     <Grid item xs={12} sm={8}>
                        <Grid container spacing={3}>
                           <Grid item xs={12} sm={6}>
                              <Controller
                                 rules={{
                                    required: {
                                       value: true,
                                       message: "Please enter Order Name",
                                    },
                                 }}
                                 control={control}
                                 name="order_date"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.order_date)}
                                       helperText={errors.order_date?.message}
                                       label="Date"
                                       type="date"
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
                                       message: "Please enter Order Name",
                                    },
                                 }}
                                 control={control}
                                 name="shipment_date"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.shipment_date)}
                                       helperText={errors.shipment_date?.message}
                                       label="Ship Date"
                                       type="date"
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
                                       message: "Please Select supplier (start type for search)",
                                    },
                                 }}
                                 control={control}
                                 name="supplier"
                                 render={({ field }) => (
                                    <AsynchronousSelect
                                       label="Select Supplier"
                                       error={errors.supplier ? errors.supplier.message : ''}
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
                                       message: "Please Select Order (start type for search)",
                                    },
                                 }}
                                 control={control}
                                 name="order"
                                 render={({ field }) => (
                                    <AsynchronousSelect
                                       label="Select Supplier"
                                       error={errors.order ? errors.order.message : ''}
                                       onSelect={field.onChange}
                                       loadOption={orderLoadOption}
                                       options={orderOptions}
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
                                       message: "Please enter Qty",
                                    },
                                 }}
                                 control={control}
                                 name="qty"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.qty)}
                                       helperText={errors.qty?.message}
                                       label="Qty"
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
                                       value: true,
                                       message: "Please enter Rate",
                                    },
                                 }}
                                 control={control}
                                 name="rate"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.rate)}
                                       helperText={errors.rate?.message}
                                       label="Rate"
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
                                       value: true,
                                       message: "Please Select Status",
                                    },
                                 }}
                                 control={control}
                                 name="status"
                                 render={({ field }) => (
                                    <FormControl fullWidth>
                                       <InputLabel id="demo-simple-select-label-status">Status</InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label-status"
                                          id="demo-simple-select-status"
                                          error={Boolean(errors.status?.message)}
                                          value={field.value}
                                          label="Status"
                                          onChange={field.onChange}
                                          size="small"
                                       >
                                          <MenuItem value={''}>{'Select'}</MenuItem>

                                          {config?.orderStatus.map((item: string) => (
                                             <MenuItem key={item} value={item}>{item}</MenuItem>
                                          ))}

                                       </Select>
                                       <FormHelperText>{errors.status?.message}</FormHelperText>
                                    </FormControl>
                                 )}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Controller
                                 rules={{
                                    required: {
                                       value: false,
                                       message: "Please enter Descriptions",
                                    },
                                 }}
                                 control={control}
                                 name="description"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.description)}
                                       helperText={errors.description?.message}
                                       label="Description"

                                       size="small"
                                       fullWidth
                                    />
                                 )}
                              />
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={12} sm={4} p={3}>
                        <Box sx={{ height: '100%' }} >
                           <Box
                             
                              sx={{ border: '1px dashed #aaa', width: '100%', cursor: 'pointer', height: '100%', borderRadius: 3, overflow: 'hidden', p: 3, boxShadow: 2 }}>
                              {order ? <img width={'100%'} height={'100%'} style={{ maxHeight: '250px' }} src={order.avatar} alt="img" /> : 'Select Image To Show Image'}

                           </Box>
                        </Box>
                     </Grid>
                  </Grid>
                  <Box width={'100%'} display={'flex'}>
                     <Button sx={{ mt: 2, ml: 'auto' }} type="submit" variant="contained" >Save</Button>
                  </Box>
               </Box>
            </Paper>
         </Box>
      </Container>
   )
}


export default PurchaseOrderForm