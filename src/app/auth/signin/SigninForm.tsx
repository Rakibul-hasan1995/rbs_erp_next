'use client';;
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { FaLock } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Axios } from "@/v1/utils/axios-config";



export interface UserInitialValues {
   password: string,
   email: string,
}

interface SubmitResponse {
   success: boolean;
   errors: any | null;
}
interface Props {
   submit: (arg: any) => Promise<SubmitResponse>
   initialValues: UserInitialValues
}


const SigninForm = () => {

   const {
      control,
      setError,
      handleSubmit,
      reset,
      // setValue,

      formState: { errors },
   } = useForm({
      defaultValues: {
         email: '',
         password: ''
      },
   });

   const router = useRouter()
   const onSubmit = async (formData: any) => {
      const response = await Axios.post('/api/auth/signin', formData)


      console.log(response.data.data.access_token)

      if (response?.status == 200) {
         localStorage.setItem('access_token', response.data.data.access_token)
         toast.success('login success')
         router.push('/v1/dashboard')
      } else {
         setError('email', { type: 'custom', message: 'Sign in failed' })
         setError('password', { type: 'custom', message: 'Sign in failed' })
      }
   }

   return (
      <Container component={'main'} maxWidth="xs" >

         <Box
            sx={{
               marginTop: 8,
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
            }}
         >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
               <FaLock />
            </Avatar>
            <Typography component="h1" variant="h5">
               Sign in
            </Typography>
            <Box component='form' noValidate width={'100%'} onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
               <Controller
                  rules={{
                     required: {
                        value: true,
                        message: "Please enter User Name",
                     },
                  }}
                  control={control}
                  name="email"
                  render={({ field }) => (
                     <TextField
                        {...field}
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                     />
                  )}
               />
               <Controller
                  rules={{
                     required: {
                        value: true,
                        message: "Please enter User Name",
                     },
                  }}
                  control={control}
                  name="password"
                  render={({ field }) => (
                     <TextField
                        {...field}
                        margin="normal"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                     />
                  )}
               />
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
               >
                  Sign In
               </Button>
               <Grid container>
                  <Grid item xs>
                     <Link href="#">
                        Forgot password?
                     </Link>
                  </Grid>
                  <Grid item>
                     <Link href="#" >
                        {"Don't have an account? Sign Up"}
                     </Link>
                  </Grid>
               </Grid>
            </Box>
         </Box>
      </Container>
   )
}


export default SigninForm