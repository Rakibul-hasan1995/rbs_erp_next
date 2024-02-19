'use client'

import { Box, Button, CircularProgress, Divider, Grid, Grow, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import searchImg from '@/v1/assets/img/search.png'
import Image from 'next/image';
import { RiCloseLine } from 'react-icons/ri';
import { BiPencil } from 'react-icons/bi';
import { numberWithCommas } from '@/v1/utils/numberFormater';

import NextLink from 'next/link';
import { IoIosArrowDown, IoIosArrowUp, IoMdRefreshCircle } from 'react-icons/io';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { TransactionNotFound } from './TransactionNotFound';
import DotMenu from '@/v1/components/menu/dotMenu';
import { useChartOfAccountContext } from '../../chartOfAccountProvider';
import UiMenu from '@/v1/components/menu/UiMenu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { objToQueryString, queryStringToJSON } from '@/v1/utils/queryString';
import AccountForm from '../../add/form';


export default function Page() {
  const { state, setState, fetchDataById, fetchData } = useChartOfAccountContext()
  const theme = useTheme()
  const router = useRouter()

  const searchParams = useSearchParams()

  const selected = searchParams.get("selected")


  const search = searchParams.get("search")
  const search_by = searchParams.get("search_by")

  const queryObj: any = {
    search_by: searchParams.get('search_by') || '',
    search: searchParams.get('search') || ''
  }


  useEffect(() => {
    if (selected) {
      fetchDataById(selected, { sort_key: 'createdAt', sort_type: "asc", limit: 5 })
    }
  }, [selected])


  useEffect(() => {
    fetchData(objToQueryString({ ...queryObj }))
  }, [search])


  const pathName = usePathname()
  const searchQuery = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
  const pushTo = (value: any) => {
    const qu = objToQueryString({ ...queryStringToJSON(searchQuery), ...value })
    router.push(`${pathName}?` + qu)
  }


  // account_type: "Cash" | 'Expenses' | 'Income' | 'Liability' | "Asset";

  const isSelected = (id: string) => {
    return Boolean(id == state.account?._id)
  }

  const [openFormModal, setOpenFormModal] = useState(false)
  const handleOpenFormModal = () => {
    setOpenFormModal((prev) => !prev)
  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    maxHeight: 'calc(100vh - 150px)',
    overflow: 'auto'
  };


  return (
    <Box>
      <Modal
        keepMounted
        open={openFormModal}
        onClose={handleOpenFormModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <CustomScrollbarBox sx={style}>
          <Typography>Add Account</Typography>
          <AccountForm />
        </CustomScrollbarBox>
      </Modal>
      <Grid container spacing={0.5} >
        <Grid item sm={4}  >
          <Box bgcolor={theme.palette.background.default} sx={{ boxShadow: 2, display: "flex", justifyContent: "space-between", p: 2 }} >
            <Box >
              <UiMenu title={search || 'All'}
                buttonProps={{ endIcon: <IoIosArrowDown />, variant: 'outlined' }}
                itemJson={[
                  { title: 'All', onClick: () => { pushTo({ search_by: '', search: "" }) } },
                  { title: 'Expenses', onClick: () => { pushTo({ search_by: 'account_type', search: "Expenses" }) } },
                  { title: 'Income', onClick: () => { pushTo({ search_by: 'account_type', search: "Income" }) } },
                  { title: 'Liability', onClick: () => { pushTo({ search_by: 'account_type', search: "Liability" }) } },
                  { title: 'Asset', onClick: () => { pushTo({ search_by: 'account_type', search: "Asset" }) } },
                ]}
              />
            </Box>
            <Box display={'flex'}>
              <Button
                variant='contained'
                color='success'
                startIcon={<GoPlus />}
                size='small'
                onClick={handleOpenFormModal}
              >
                New
              </Button>
              <DotMenu itemJson={[{ title: 'Refresh', onClick: () => { fetchData('') }, icon: <IoMdRefreshCircle /> }]} />
            </Box>
            {state.loadingAccounts &&
              <Box zIndex={10} position={'absolute'} top={100} left={'50%'}>
                <CircularProgress />
              </Box>
            }
          </Box>
          <CustomScrollbarBox maxHeight={`calc(100vh - 136px)`}>
            {state.accounts?.length ? <List sx={{ bgcolor: theme.palette.background.paper, minHeight: `calc(100vh - 136px)`, overflow: 'auto' }}>
              {state.accounts?.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem

                    disablePadding>
                    <ListItemButton
                      // autoFocus={item.account_name == 'Payment'}
                      selected={isSelected(item._id)}
                      onClick={() => {
                        // fetchDataById(item._id)
                        router.push(`query?selected=${item._id}`)
                      }}
                      sx={{ color: theme.palette.info.light, borderLeft: isSelected(item._id) ? 5 : 0 }} >
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
              :
              <TransactionNotFound />

            }

          </CustomScrollbarBox>
        </Grid>
        <Grid item sm={8}>
          {/* 
          {
            state.loadingAccount ?
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexWrap: 'wrap' }}>
                <CircularProgress />
                <Typography ml={3} color={'CaptionText'}>loading...</Typography>
              </Box>
              :
      
          } */}
          {
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



                <CustomScrollbarBox maxHeight={`calc(100vh - 152px)`}>
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
                            <TableCell
                              align='right'
                            >
                              Debit
                            </TableCell>
                            <TableCell
                              align='right'
                            >
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
                        <Link
                          component={NextLink}
                          style={{ paddingTop: '20px' }} href={`/v2/chart_of_accounts/details/${state.account._id}`}>
                          <Typography>Show More details</Typography>
                        </Link>
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



