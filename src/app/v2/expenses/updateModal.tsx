import { CustomScrollbarBox } from "@/v1/components/CustomScrollBox";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MdClose } from "react-icons/md";
import ExpenseForm from "./add/ExpenseForm";
import moment from "moment";
import toast from "react-hot-toast";
import { Axios } from "@/v1/utils/axios-config";
import { useSearchParams } from "next/navigation";
import { TransactionFormatted } from "@/types/transaction";
import { useTransactionContext } from "./TransactionProvider";


const style = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '60%',
   bgcolor: 'background.paper',
   // border: '2px solid #000',
   boxShadow: 24,
   p: 2,
   maxHeight: 'calc(100vh - 50px)',
   overflow: 'auto',
   borderRadius: 1,
};




const UpdateModal = forwardRef((_props, ref) => {

   const searchParams = useSearchParams()
   const selected_id = searchParams.get('selected')

   const [openFormModal, setOpenFormModal] = useState(false)
   const handleOpenFormModal = () => {
      setOpenFormModal((prev) => !prev)
   }

   const {fetchData,state} = useTransactionContext()
   useImperativeHandle(ref, () => ({
      openModal() {
         handleOpenFormModal()
      }
   }));

   // date, amount, status, image, reference
   const [initialValue, setInitialValue] = useState<any>({
      amount: 0,
      reference: '',
      date: moment().format('yyyy-MM-DD'),
      image: null
   })
   useEffect(() => {
      if (selected_id && openFormModal) {
         getData(selected_id)
      }
   }, [selected_id, openFormModal])
   const getData = async (id: string) => {
      try {
         const { data } = await Axios.get(`/api/v2/transactions/${id}`)
         const tr: TransactionFormatted = data.data
         const obj = {
            amount: tr.debit_amount,
            reference: tr.reference,
            date: moment(tr.date).format('yyyy-MM-DD'),
            image: tr.image
         }
         console.log(obj)
         console.log(tr)
         setInitialValue({ ...obj })
      } catch (error) {
         console.log(error)
      }
   }


   const submit = async (formData: any) => {
      try {
         const { data } = await toast.promise(
            Axios.put(`/api/v2/transactions/${selected_id}`, formData),
            {
               loading: 'Saving...',
               success: <b>Data saved!</b>,
               error: <b>Could not save.</b>,
            }
         );
         if (data.code === 400) {
            return { success: false, errors: data.errors };
         } else if (data.code === 200 || data.code === 201) {
            toast.success(`Successfully save Transaction `);
            // successCB && successCB()
            fetchData(state.lastQuery)
            handleOpenFormModal()
            return { success: true, errors: null };

         }

         // Add a default return statement if none of the conditions are met
         return { success: false, errors: 'Unexpected response code' };

      } catch (err: any) {
         if (err.response) {
            const { data, message } = err.response;
            toast.error(message || 'error');
            return { success: false, errors: data };
         }

         // Handle other types of errors and return a default response
         return { success: false, errors: 'Unexpected error' };
      }
   }


   return (
      <>
         <Modal open={openFormModal} >
            <CustomScrollbarBox sx={style}>
               <Box display={'flex'} alignItems={"center"} justifyContent={"space-between"}>
                  <Typography>Update Expense</Typography>
                  <IconButton color='error' onClick={handleOpenFormModal}>
                     <MdClose />
                  </IconButton>
               </Box>
               {openFormModal  && initialValue.amount && <ExpenseForm submit={submit} initialValues={initialValue} mode="update" />}
            </CustomScrollbarBox>
         </Modal>
      </>
   )
});


export { UpdateModal }