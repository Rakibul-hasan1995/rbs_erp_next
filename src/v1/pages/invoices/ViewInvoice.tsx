'use client';
import { BlobProvider } from "@react-pdf/renderer";
import React from "react";

import { Axios, serverUrl } from "../../utils/axios-config";

import { useParams } from "next/navigation";
import InvoiceDoc from "@/v1/pdf_pages/invoicePdf";
import useWindowDimensions from "@/v1/hooks/useWindowDimension";
import {
   Box,
   Button,
   IconButton,

   InputBase,

   Paper,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Tooltip,
   Typography,
} from "@mui/material";
import { InvoiceExpand } from "@/v1/utils/Types";
import moment from "moment";
import { numberWithCommas } from "@/v1/utils/numberFormater";
import { ToWords } from "to-words";
import { FaPrint } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import Link from "next/link";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const ViewInvoice = () => {

   const activePage = useParams();
   const id = activePage._id || "";


   const [data, setData] = React.useState<InvoiceExpand>()


   React.useEffect(() => {
      if (id) {
         getInvoice()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id])
   const getInvoice = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/invoices/${id}?expand=true`)
         const invoice: InvoiceExpand = data.data
         setData(invoice)
      } catch (error) {
         console.log(error)
      }
   }

   const toWords = new ToWords({
      localeCode: "en-BD",
      converterOptions: {
         currency: true,
         ignoreDecimal: false,
         ignoreZeroCurrency: false,
         doNotAddOnly: false,
      },
   });



   React.useEffect(() => {
      const socket = io(`${serverUrl}/api/v1/orders`);
      if (data) {
         handleSocket(socket)
      }
      return () => { socket.disconnect() }
   }, [data])

   const handleSocket = async (socket: any) => {
      socket.on("changes", (SocketData: any) => {
         const find = data?.items.find((item) => item._id == SocketData._id)
         if (find) {
            getInvoice()
         }
      });
   }


   return (
      <Box sx={{ userSelect: 'none' }}>
         {data &&
            <>
               <Box component={Paper} width={'220mm'} height={'290mm'} mx={'auto'} sx={{ color: 'black' }} position={'relative'} pt={2} bgcolor={'white'}>
                  <img src="https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png" width={'100%'} />
                  <Box p={8} >
                     <Box display={'flex'} justifyContent={'space-between'} mb={3}>
                        <div>
                           <Typography >To</Typography>
                           <Typography fontWeight={'bold'}>{data?.customer.user_name}.</Typography>
                           <Typography>{data?.customer.contact_details.address}.</Typography>
                        </div>
                        <div>
                           <Typography>Invoice Date : {moment(data?.date).format('DD-MMM-YY')}</Typography>
                           <Typography>Invoice No   : <strong>{data?.invoice_no}</strong></Typography>
                           <Typography>Bill No      : {data?.customer_bill_no}</Typography>
                        </div>
                     </Box>
                     <Typography my={1} fontWeight={'bold'}>Sub: Bill For Embroider Work</Typography>
                     <Table size="small" sx={{ color: 'black', textEmphasisColor: 'black' }} >
                        <TableHead>
                           <TableRow>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '25%', color: 'black', fontWeight: 'bold' }}>Style</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '5%', color: 'black', fontWeight: 'bold' }}>Design</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '20%', color: 'black', fontWeight: 'bold' }}>CH-No</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Qty</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Rate</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Total(usd)</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Total(BDT)</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {data?.items.map((item) => (
                              <TableRow key={item._id} >
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>{item.program_name} <Cell data={{ name: 'order_name', order: item }} /> </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}> <img src={item.cover_photo.href} width={70} height={40} alt="" /> </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>{item?.challan_no}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="center"><Cell data={{ name: 'qty', order: item }} /></TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="center"><Cell data={{ name: 'rate', order: item }} /></TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="right">{numberWithCommas(item.totalUsd)}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="right">{numberWithCommas(item.totalBdt)}</TableCell>
                              </TableRow>
                           ))}
                           <TableRow>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} colSpan={4} align="center">Discount</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} colSpan={2} align="center">{numberWithCommas(data?.discount)}%</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="right">- {numberWithCommas(data?.discountAmount)}</TableCell>
                           </TableRow>
                        </TableBody>
                        <TableHead>
                           <TableRow>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="center" colSpan={3}>Total</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="center">{data?.totalQty}</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}> </TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="right">{numberWithCommas(data?.totalAmountUSD)}</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="right">{data?.totalAmountBDT}</TableCell>
                           </TableRow>
                        </TableHead>
                     </Table>
                     <Typography my={1}>in words : {toWords.convert(data?.totalAmountBDT || 0)}</Typography>
                     <Typography fontStyle={'italic'} my={3}>Early Payment Will Be Appreciated </Typography>
                     <Typography fontStyle={'italic'} my={2}>Thanks</Typography>
                     <Box p={3} display={'flex'} justifyContent={'space-between'}>
                        <Typography fontStyle={'oblique'}> <u>Received By</u> </Typography>
                        <Typography fontStyle={'oblique'}><u>For: Monapy Embroidery</u></Typography>
                     </Box>


                  </Box>
                  <Box position={'absolute'} bottom={40} width={'100%'}>
                     <Typography textAlign={'center'}>A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420</Typography>
                  </Box>
               </Box>
               <Box position={'fixed'} flexDirection={'column'} gap={2} display={'flex'} top={100} right={20} bgcolor={'black'} p={2} borderRadius={5}>

                  <BlobProvider document={<InvoiceDoc showHeader={false} pageData={data} />}>
                     {({ url }) => (
                        <Link href={`${url}`} target="_blank">
                           <IconButton color="info" >
                              <FaPrint />
                           </IconButton>
                        </Link>
                     )}
                  </BlobProvider>

                  <BlobProvider document={<InvoiceDoc showHeader={true} pageData={data} />}>
                     {({ url }) => (
                        <Link href={`${url}`} target="_blank">
                           <IconButton color="warning">
                              <MdFileDownload />
                           </IconButton>
                        </Link>
                     )}
                  </BlobProvider>
                  <Link href={`/v1/invoices/update/${id}`} passHref legacyBehavior>
                     <IconButton color='error'>
                        <TbEdit />
                     </IconButton>
                  </Link>

               </Box>
            </>
         }


      </Box>

   )
}

export default ViewInvoice


const Cell = ({ data }: { data: { name: string, order: any } }) => {

   const { name, order } = data
   const value = order[name]

   const [inputValue, setInputValue] = React.useState(value)
   const [isEditMode, setEditMode] = React.useState(false)
   const handleInputChange = (e: any) => {
      const text = e.target.value
      setInputValue(text)
   }

   const submit = async (e: any) => {
      e.preventDefault();
      try {
         const obj = { [name]: inputValue }
         const id = order._id
         const { data } = await Axios.put(`api/v1/orders/${id}`, obj)

         if (data.code == 200) {
            toast.success(`successfully update ${data.data.order_name} - ${name}`)
         }
      } catch (error) {
         console.log(error)
         toast.error(`error in update Order`)
      }
   }


   return (
      <>
         {isEditMode ? <Box component={'form'} onSubmit={submit}>
            <InputBase onBlur={() => setEditMode(false)} sx={{ color: 'black' }} value={inputValue} onChange={handleInputChange} />
            <Button type="submit" sx={{ display: 'none' }}></Button>
         </Box> :
            <Tooltip title={'double click for edit'}>
               <span onDoubleClick={() => setEditMode(true)}>{inputValue}</span>
            </Tooltip>
         }
      </>
   )
}