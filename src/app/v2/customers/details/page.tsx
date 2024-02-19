'use client';;
import {
   Box,
   Button,
   CircularProgress,
   Divider,
   Grid,
   IconButton,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Stack,
   Typography,
   useTheme,
} from '@mui/material';

import React, { useEffect, useRef } from 'react';
import { GoPlus } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import searchImg from '@/v1/assets/img/search.png'
import Image from 'next/image';
import { RiCloseLine } from 'react-icons/ri';
import { BiLock, BiPencil } from 'react-icons/bi';

import { IoIosArrowDown, IoMdRefreshCircle } from 'react-icons/io';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import UiMenu from '@/v1/components/menu/UiMenu';
import DotMenu from '@/v1/components/menu/dotMenu';
import { useSearchParams } from 'next/navigation';
import useSearchParamsHook from '@/v1/hooks/useSearchParams';

import { useThemeContext } from '@/v1/context/themeContext';
import { useCustomerContext } from '../context';
import CustomerTabs from './tabs';


export default function Page() {
   const { customer: selected, customers, fetchData, fetchDataById, lastQuery, loading, setCustomer } = useCustomerContext()
   const theme = useTheme()
   const { setTitle } = useThemeContext()



   // useEffect(() => {
   //    fetchData({ limit: 10, search: 'Expense', search_by: "type", is_debit: 'true', sort_key: "createdAt", sort_type: "asc" })
   // }, [])
   useEffect(() => {
      setTitle("Customers")
      return () => {
         setTitle("RBS")
      }
   }, [])


   const searchParams = useSearchParams()
   const selected_id = searchParams.get('selected')
   const { pushQuery } = useSearchParamsHook()
   useEffect(() => {
      if (selected_id == 'undefined') {
         return setCustomer(null)
      }

      if (selected_id && !loading.customers) {
         handleSelectItem()
      }
   }, [selected_id, customers])

   const handleSelectItem = async () => {
      if (customers?.data?.length) {
         const find = customers.data.find(item => item?._id == selected_id)
         if (find) {
            setCustomer({ data: find, code: 200 })
         } else if (selected_id) {
            const data = await fetchDataById(`${selected_id}`)
            customers?.data?.push(data)
            setCustomer({ data, code: 200 })
         }

      } else {
         // const data = await fetchDataById(`${selected_id}`)
         // setCustomer({ data, code: 200 })
      }
   }


   const isSelected = (id: string) => {
      return Boolean(id == selected_id)
   }

   const addRef = useRef<any>()
   const updateRef = useRef<any>()

   return (
      <Box>
         {/* <AddModal ref={addRef} />
         <UpdateModal ref={updateRef} /> */}

         <Grid container spacing={0.5} >
            <Grid item sm={3} position={'relative'} >
               <Box bgcolor={theme.palette.background.default} sx={{ boxShadow: 2, display: "flex", justifyContent: "space-between", p: 2 }} >
                  <Box >
                     <UiMenu title='All' itemJson={[]}
                        buttonProps={{ endIcon: <IoIosArrowDown />, variant: 'outlined' }}
                     />
                  </Box>
                  <Stack direction={'row'} spacing={2}>
                     <Button
                        variant='contained'
                        color='success'
                        startIcon={<GoPlus />}
                        size='small'
                        sx={{ maxHeight: 30, my: "auto" }}
                        onClick={() => addRef?.current?.openModal()}
                     >
                        New
                     </Button>
                     <DotMenu itemJson={[{ title: 'Refresh', onClick: () => { fetchData(lastQuery) }, icon: <IoMdRefreshCircle /> }]} />
                  </Stack>
               </Box>
               {loading.customers && <Box position={'absolute'} top={100} zIndex={2} left={'50%'} display={'flex'} justifyContent={'center'} my={2}> <CircularProgress /></Box>}
               <CustomScrollbarBox maxHeight={`calc(100vh - 136px)`}>
                  <List sx={{ bgcolor: theme.palette.background.paper, minHeight: `calc(100vh - 136px)`, overflow: 'auto' }}>
                     {
                        customers?.data?.map((item) => (
                           <React.Fragment key={item?._id}>
                              <ListItem
                                 disablePadding>
                                 <ListItemButton
                                    autoFocus={isSelected(item?._id)}
                                    selected={isSelected(item?._id)}
                                    onClick={() => pushQuery({ selected: item._id })}
                                    sx={{ color: theme.palette.info.light, borderLeft: isSelected(item?._id) ? 5 : 0 }}
                                 >
                                    <ListItemIcon>
                                       <BiLock />
                                    </ListItemIcon>
                                    <ListItemText
                                       primary={item?.name}
                                       secondary={item?.closing_amount_formatted}

                                    />

                                 </ListItemButton>
                              </ListItem>
                              <Divider />
                           </React.Fragment>
                        ))}
                  </List>
               </CustomScrollbarBox>
            </Grid>
            <Grid item sm={9}>
               {
                  loading.customers ?
                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexWrap: 'wrap' }}>
                        <CircularProgress />
                        <Typography ml={3} >loading...</Typography>
                     </Box>
                     :
                     selected ?
                        <Box>
                           {/* top header ====>>> */}
                           <Box display={'flex'} justifyContent={"space-between"} p={2} bgcolor={theme.palette.background.paper}>
                              <Box >
                                 <Typography variant='h6' fontWeight={'500'}  >{selected.data?.name}</Typography>
                              </Box>
                              <IconButton onClick={() => pushQuery({ selected: undefined })}>
                                 <RiCloseLine />
                              </IconButton>
                           </Box>
                           {/* top header ====<<< */}



                           <CustomScrollbarBox bgcolor={theme.palette.background.paper} maxHeight={`calc(100vh - 136px)`}>
                              {/* edit row ====>>> */}
                              <Box position={'sticky'} top={0} sx={{ zIndex: 10, backdropFilter: "blur(10px)" }} bgcolor={theme.shadows}  >
                                 {/* <UpdateExpense /> */}
                                 <Button
                                    sx={{ m: 1 }}
                                    variant='text'
                                    onClick={() => updateRef?.current?.openModal()}
                                    startIcon={<BiPencil />}>
                                    Edit
                                 </Button>
                                 |
                                 <IconButton color='info' >
                                    <HiOutlineDotsHorizontal />
                                 </IconButton>
                                 |
                                 <Divider />
                              </Box>
                              {/* edit row ====<<< */}

                              {/* transaction Body ====>>> */}
                              <Box>
                                 <CustomerTabs />
                              </Box>
                              {/* transaction Body ====<<< */}

                           </CustomScrollbarBox>
                        </Box>
                        :
                        <DataNotSelected />
               }
            </Grid>

         </Grid>

      </Box>
   )
}


const DataNotSelected = () => {
   return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexWrap: 'wrap' }}>
         <Box textAlign={"center"} >
            <Image
               style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }}
               src={searchImg}
               width={50}
               height={50}
               alt="Picture of the author"
            />
            <Typography>Select an item to show </Typography>
            <Typography variant='caption'>Nothing is selected</Typography>
         </Box>
      </Box>
   )
}



