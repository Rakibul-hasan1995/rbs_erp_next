
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
   Box,
   Button,
   ButtonBase,
   Container,
   Fab,
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
import { useState, useEffect } from "react";
import useConfig from "@/v1/hooks/useConfig";
import { RiImageAddFill } from "react-icons/ri";
import { uploader } from "@/v1/utils/uploadFile";
import { Axios } from "@/v1/utils/axios-config";


export interface OrderInitialValues {
   order_name: string,
   stitching: string,
   order_date: string,
   shipment_date: string,
   customer: AsyncSelectOptionOption | null,
   qty: string,
   rate: string,
   currency: string,
   unit: string,
   category: string,
   status: string,
   tags: string,
   description: string,
   cover_photo: {
      _id: string,
      href: string
   } | null;
}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: OrderInitialValues
}





const OrderForm = ({ submit, initialValues }: Props) => {

   const [files, setFiles] = useState<any>();
   const [imgUrl, setImgUrl] = useState('');
   const [fileId, setFileId] = useState<any>()




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

   useEffect(() => {
      if (initialValues.cover_photo) {
         setFileId(initialValues.cover_photo._id)
         setImgUrl(initialValues.cover_photo.href)
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
         const fileData = new FormData()
         fileData.append('file', files)
         formData.customer = formData.customer.value
         if (!fileId) {
            const { data, success } = await toast.promise(
               uploader(fileData),
               {
                  loading: 'Uploading File...',
                  success: <b>Upload Success</b>,
                  error: <b>Upload Error.</b>
               }
            )

            if (!success) {
               return toast.error('File Upload Failed')
            }
            const url = data.secure_url
            const galleryObj = {
               href: url,
               tags: `${formData.order_name} ${formData.category}`,
               name: `${formData.order_name}`
            }
            const gallery = await Axios.post('/api/v1/gallery', galleryObj)
            const galleryId = gallery.data.data._id
            setFileId(galleryId)
            formData.cover_photo = galleryId
         } else {
            formData.cover_photo = fileId
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
   const { userLoadOption, userOptions } = useSelectCustomer('roll=customer')

   const { config } = useConfig()

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles[0]);
      setFileId('')
      setImgUrl(URL.createObjectURL(droppedFiles[0]));
   };

   const handleFileChange = (e: any) => {
      // setFileId('')

      if (e.target.files.length) {
         setFiles(e.target.files[0])
         setFileId('')
         setImgUrl(URL?.createObjectURL(e.target.files[0]));
      }
   };

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
                                 name="order_name"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.order_name)}
                                       helperText={errors.order_name?.message}
                                       label="Order Name"
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
                                 name="stitching"
                                 render={({ field }) => (
                                    <TextField
                                       {...field}
                                       error={Boolean(errors.stitching)}
                                       helperText={errors.stitching?.message}
                                       label="Stitch"
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
                                       message: "Please Select customer (start type for search)",
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
                                       message: "Please Select Currency",
                                    },
                                 }}
                                 control={control}
                                 name="currency"
                                 render={({ field }) => (
                                    <FormControl fullWidth>
                                       <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select-cure"
                                          error={Boolean(errors.currency?.message)}
                                          value={field.value}
                                          label="Currency"
                                          onChange={field.onChange}
                                          size="small"
                                       >
                                          <MenuItem value={'BDT'}>BDT</MenuItem>
                                          <MenuItem value={'USD'}>USD</MenuItem>

                                       </Select>
                                       <FormHelperText>{errors.currency?.message}</FormHelperText>
                                    </FormControl>
                                 )}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Controller
                                 rules={{
                                    required: {
                                       value: true,
                                       message: "Please Select Unit",
                                    },
                                 }}
                                 control={control}
                                 name="unit"
                                 render={({ field }) => (
                                    <FormControl fullWidth>
                                       <InputLabel id="demo-simple-select-label-unit">Unit</InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label-unit"
                                          id="demo-simple-select-unit"
                                          error={Boolean(errors.unit?.message)}
                                          value={field.value}
                                          label="unit"
                                          onChange={field.onChange}
                                          size="small"
                                       >
                                          <MenuItem disabled value={''}>Select</MenuItem>

                                          <MenuItem value={'Pcs'}>Pcs</MenuItem>
                                          <MenuItem value={'Dzn'}>Dzn</MenuItem>
                                          <MenuItem value={'Yards'}>Yards</MenuItem>
                                          <MenuItem value={'Cone'}>Cone</MenuItem>
                                          <MenuItem value={'KG'}>KG</MenuItem>
                                          <MenuItem value={'LTR'}>LTR</MenuItem>

                                       </Select>
                                       <FormHelperText>{errors.unit?.message}</FormHelperText>
                                    </FormControl>
                                 )}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Controller
                                 rules={{
                                    required: {
                                       value: true,
                                       message: "Please Select Category",
                                    },
                                 }}
                                 control={control}
                                 name="category"
                                 render={({ field }) => (
                                    <FormControl fullWidth>
                                       <InputLabel id="demo-simple-select-label-category">Category</InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label-category"
                                          id="demo-simple-select-cet"
                                          error={Boolean(errors.category?.message)}
                                          value={field.value}
                                          label="Category"
                                          onChange={field.onChange}
                                          size="small"
                                       >
                                          <MenuItem value={'t-shirt'}>t-shirt</MenuItem>
                                          <MenuItem value={'jersey'}>jersey</MenuItem>
                                       </Select>
                                       <FormHelperText>{errors.category?.message}</FormHelperText>
                                    </FormControl>
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
                              component={ButtonBase}
                              onDrop={handleDrop}
                              onDragOver={(e) => e.preventDefault()}

                              sx={{ border: '1px dashed #aaa', width: '100%', cursor: 'pointer', height: '100%', borderRadius: 3, overflow: 'hidden', p: 3, boxShadow: 2 }}>
                              {imgUrl ? <img width={'100%'} height={'100%'} style={{ maxHeight: '250px' }} src={imgUrl} alt="img" /> : 'Drag and drop'}
                              <Fab component="label" size={'small'} sx={{ bottom: 0, right: 0, position: 'absolute' }} color="primary" aria-label="add">
                                 <RiImageAddFill />
                                 <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                 />
                              </Fab>
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


export default OrderForm