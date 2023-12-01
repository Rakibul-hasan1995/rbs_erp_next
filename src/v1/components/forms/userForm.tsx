'use client';;
import { Controller, useForm } from "react-hook-form";
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
import useConfig from "@/v1/hooks/useConfig";



export interface UserInitialValues {
   user_name: string,
   email: string,
   roll: string,
   contact_details: {
      address: string,
      phone: string,
      contactParsonName: string,
   }
}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: UserInitialValues
}





const UserForm = ({ submit, initialValues }: Props) => {

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

   // useEffect(() => {
   //    if (initialValues.cover_photo) {
   //       setFileId(initialValues.cover_photo._id)
   //       setImgUrl(initialValues.cover_photo.href)
   //       reset(initialValues)
   //    }

   // }, [initialValues])

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
                              message: "Please enter User Name",
                           },
                        }}
                        control={control}
                        name="user_name"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.user_name)}
                              helperText={errors.user_name?.message}
                              label="User Name"
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
                              message: "Please enter User Email",
                           },
                        }}
                        control={control}
                        name="email"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.email)}
                              helperText={errors.email?.message}
                              label="Email"
                              type="email"
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
                              message: "Please enter User Address",
                           },
                        }}
                        control={control}
                        name="contact_details.address"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.contact_details?.address)}
                              helperText={errors.contact_details?.address?.message}
                              label="Address"

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
                              message: "Please enter User Address",
                           },
                        }}
                        control={control}
                        name="contact_details.phone"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.contact_details?.phone)}
                              helperText={errors.contact_details?.phone?.message}
                              label="Phone"

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
                              message: "Please enter Contact person name",
                           },
                        }}
                        control={control}
                        name="contact_details.contactParsonName"
                        render={({ field }) => (
                           <TextField
                              {...field}
                              error={Boolean(errors.contact_details?.contactParsonName)}
                              helperText={errors.contact_details?.contactParsonName?.message}
                              label="Contact Parson Name"

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
                        name="roll"
                        render={({ field }) => (
                           <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label-status">Roll</InputLabel>
                              <Select
                                 labelId="demo-simple-select-label-status"
                                 id="demo-simple-select-status"
                                 error={Boolean(errors.roll?.message)}
                                 value={field.value}
                                 label="Roll"
                                 onChange={field.onChange}
                                 size="small"
                              >
                                 <MenuItem value={''}>{'Select'}</MenuItem>

                                 {config?.userRolls.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                 ))}

                              </Select>
                              <FormHelperText>{errors.roll?.message}</FormHelperText>
                           </FormControl>
                        )}
                     />
                  </Grid>

               </Grid>
               <Box width={'100%'} display={'flex'}>
                  <Button sx={{ mt: 2, ml: 'auto' }} type="submit" variant="contained" >Save</Button>
               </Box>
            </Box>
         </Paper>
      </Container>
   )
}


export default UserForm