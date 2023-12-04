
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Image from 'next/image';
import { OrderExpand } from '@/v1/utils/Types';
import { Box, IconButton, Typography } from '@mui/material';
import { Axios } from '@/v1/utils/axios-config';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaRegClone } from 'react-icons/fa';

const Transition = React.forwardRef(function Transition(
   props: TransitionProps & {
      children: React.ReactElement<any, any>;
   },
   ref: React.Ref<unknown>,
) {
   return <Slide direction="up" ref={ref} {...props} />;
});

export default function CloneDialog({ order }: { order: OrderExpand }) {
   const [open, setOpen] = React.useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const router = useRouter()

   const handleConfirmClone = async () => {
      try {
         const { data } = await Axios.patch(`/api/v1/orders/${order._id}`)
         if (data.code == 201) {
            toast.success('clone Success')
         }
         router.push(`/v1/orders/profile/${data.data._id}`)
      } catch (error) {
         console.log(error)
         toast.error('error')
      }
   };



   return (
      <React.Fragment>
         <Button   color='primary' onClick={handleClickOpen} startIcon={<FaRegClone />} >
             Clone
         </Button>
         {/* <IconButton color='info' >
            <FaRegClone />
         </IconButton> */}
         <Dialog
            maxWidth={'lg'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
         >
            <DialogTitle color={'orange'} >{'Are you sure to clone ?'}</DialogTitle>
            <DialogContent >
               <Box display={'flex'} gap={2} alignItems={'center'} justifyContent={'space-around'}>
                  <Image style={{ borderRadius: '100%' }} width={100} height={100} src={order.cover_photo.href} alt='image' />
                  <Box>

                     <Typography fontWeight={'800'}>{`${order.program_name} ${order.order_name}`}</Typography>
                     <Typography>Ist Make Duplicate this order, </Typography>
                     <Typography color={'orange'}>This action cannot be undone. </Typography>
                  </Box>
                  {/* <DialogContentText id="alert-dialog-slide-description">
                    Ist Make Duplicate this order, <br /> This action cannot be undone.
                  </DialogContentText> */}
               </Box>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button color='error' onClick={handleConfirmClone}>Confirm</Button>
            </DialogActions>
         </Dialog>
      </React.Fragment>
   );
}
