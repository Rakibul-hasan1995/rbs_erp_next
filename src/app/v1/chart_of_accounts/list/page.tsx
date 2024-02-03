'use client'
import COAListTopMenu from '@/v1/components/chartOfAccount/list/topMenu';
import { useChartOfAccountContext } from '@/v1/context/chartOfAccountProvider';
import { Box, Button, CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system';
import React from 'react'
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import searchImg from '@/v1/assets/img/search.png'
import Image from 'next/image';
import { RiCloseLine } from 'react-icons/ri';
import { BiPencil } from 'react-icons/bi';
import { numberWithCommas } from '@/v1/utils/numberFormater';

import Link from 'next/link';
import DotMenu from '@/v1/components/chartOfAccount/list/dotMenu';
import { IoMdRefreshCircle } from 'react-icons/io';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { TransactionNotFound } from './TrnsactionNotFound';



export default function Page() {
  const { state, setState, fetchDataById, fetchData } = useChartOfAccountContext()
  const theme = useTheme()

  const isSelected = (id: string) => {
    return Boolean(id == state.account?._id)
  }
  return (
    <Box>
      <Grid container spacing={0.5} >
        <Grid item sm={4}  >
          <Box bgcolor={theme.palette.background.default} sx={{ boxShadow: 2, }} >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <COAListTopMenu />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      color='success'
                      startIcon={<GoPlus />}
                      size='small'
                    >
                      New
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DotMenu itemJson={[{ title: 'Refresh', onClick: () => { fetchData('') }, icon: <IoMdRefreshCircle /> }]} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {state.loadingAccounts && <Box display={'flex'} justifyContent={'center'} my={2}> <CircularProgress /></Box>}
          </Box>

          <CustomScrollbarBox maxHeight={`calc(100vh - 171px)`}>
            <List sx={{ bgcolor: theme.palette.background.paper, minHeight: `calc(100vh - 171px)`, overflow: 'auto' }}>
              {state.accounts?.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem

                    disablePadding>
                    <ListItemButton
                      // autoFocus={item.account_name == 'Payment'}
                      selected={isSelected(item._id)}
                      onClick={() => fetchDataById(item._id)}
                      sx={{ color: 'Highlight', borderLeft: isSelected(item._id) ? 5 : 0 }} >
                      <Box mx={3}>
                        {item.is_system_account ? <IoLockClosedOutline /> : <IoLockOpenOutline />}
                      </Box>

                      <ListItemText
                        primaryTypographyProps={{ fontWeight: "400" }}
                        primary={item.account_name}
                        secondary={item.account_type}

                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

          </CustomScrollbarBox>
        </Grid>
        <Grid item sm={8}>

          {
            state.loadingAccount ?
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexWrap: 'wrap' }}>
                <CircularProgress />
                <Typography ml={3} color={'CaptionText'}>loading...</Typography>
              </Box>
              :
              state.account ?
                <Box>
                  {/* top header ====>>> */}
                  <Box display={'flex'} justifyContent={"space-between"} p={2} bgcolor={theme.palette.background.paper}>
                    <Box >
                      <Typography variant='caption'>{state.account.account_type}</Typography>
                      <Typography variant='h6' fontWeight={'500'}  >{state.account.account_name}</Typography>
                    </Box>
                    <IconButton onClick={() => setState((prev) => ({ ...prev, account: undefined }))}>
                      <RiCloseLine />
                    </IconButton>
                  </Box>
                  {/* top header ====<<< */}



                  <CustomScrollbarBox  maxHeight={`calc(100vh - 185px)`}>
                    {/* edit row ====>>> */}
                    <Box position={'sticky'} top={0} sx={{ zIndex: 10, backdropFilter: "blur(10px)" }} bgcolor={theme.shadows}  >
                      <Button
                        sx={{ m: 1 }}
                        variant='text'
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

                    {/* info row ====>>> */}
                    <Box p={2} borderBottom={'3px dashed'} >
                      <Typography >Closing Balance</Typography>
                      <Typography variant='h4' color={'Highlight'} >BDT {numberWithCommas(state.account.closing_balance)}</Typography>
                      <Typography component={"i"} >Description: <Typography>{state.account.description}</Typography></Typography>
                    </Box>
                    {/* info row ====<<< */}

                    {/* transaction Body ====>>> */}
                    <Box p={2} bgcolor={theme.palette.background.paper} minHeight={'calc(100vh - 325px)'} width={'100%'}  >
                      <Typography variant='h5'>Recent Transactions</Typography>

                      {state.account.transactions?.length ?
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                Date
                              </TableCell>
                              <TableCell>
                                Transaction Details
                              </TableCell>
                              <TableCell>
                                Type
                              </TableCell>
                              <TableCell>
                                Debit
                              </TableCell>
                              <TableCell>
                                Credit
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>

                            {state.account.transactions?.map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>
                                  {item.date_formatted}
                                </TableCell>
                                <TableCell>
                                  {item.transaction_details}
                                </TableCell>
                                <TableCell>
                                  {item.type}
                                </TableCell>
                                <TableCell align='right'>
                                  {item.debit_amount_formatted}
                                </TableCell>
                                <TableCell align='right'>
                                  {item.credit_amount_formatted}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <Link style={{ paddingTop: '20px' }} href={`/v1/chart_of_accounts/details/${state.account._id}`}>Show More details</Link>
                        </Table>
                        :
                        <TransactionNotFound />
                      }
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



