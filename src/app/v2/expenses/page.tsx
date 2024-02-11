'use client';
import { Box, Button, ButtonBase, CircularProgress, Link, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme, Modal } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { GoPlus } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import searchImg from '@/v1/assets/img/search.png'
import Image from 'next/image';
import { RiCloseLine, RiImageAddFill } from 'react-icons/ri';
import { BiLock, BiPencil } from 'react-icons/bi';
import { TiAttachment } from "react-icons/ti";

import { IoIosArrowDown, IoMdRefreshCircle } from 'react-icons/io';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { useTransactionContext } from '@/app/v2/expenses/TransactionProvider';
import { TransactionFormatted } from '@/types/transaction';
import UiMenu from '@/v1/components/menu/UiMenu';
import DotMenu from '@/v1/components/menu/dotMenu';
import { useSearchParams } from 'next/navigation';
import useSearchParamsHook from '@/v1/hooks/useSearchParams';
import { MdClose, MdOutlineFileUpload } from 'react-icons/md';
import { useUploadTransactionFile } from './useUploadFile';
import NextLink from 'next/link';
import { useThemeContext } from '@/v1/context/themeContext';
import ExpenseForm from './add/ExpenseForm';
import useAddExpense from '@/hooks/useAddExpense';


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
export default function Page() {
  const { state, setState, fetchDataById, fetchData } = useTransactionContext()
  const theme = useTheme()
  const { setTitle } = useThemeContext()

  useEffect(() => {
    fetchData({ limit: 100, search: 'Expense', search_by: "type", is_debit: 'true', sort_key: "createdAt", sort_type: "asc" })
  }, [])
  useEffect(() => {
    setTitle("Expenses")
    return () => {
      setTitle("RBS")
    }
  }, [])

  const [selected, setSelected] = useState<TransactionFormatted>()

  const searchParams = useSearchParams()
  const selected_id = searchParams.get('selected')
  const { pushQuery } = useSearchParamsHook()
  useEffect(() => {
    handleSelectItem()
  }, [selected_id, state.transactions])

  const handleSelectItem = async () => {
    if (state.transactions?.length) {
      const find = state.transactions.find(item => item._id == selected_id)
      setSelected(find)
    } else {
      const data = await fetchDataById(`${selected_id}`)
      setSelected(data)
    }
  }
  const { handleDrop, handleFileChange, imgUrl } = useUploadTransactionFile()


  const isSelected = (id: string) => {
    return Boolean(id == selected_id)
  }

  const [openFormModal, setOpenFormModal] = useState(false)
  const handleOpenFormModal = () => {
    setOpenFormModal((prev) => !prev)
  }



  const { submit, initialValues } = useAddExpense({ successCB: () => { } })

  return (
    <Box>
      <Modal
        keepMounted
        open={openFormModal}
        // onClose={handleOpenFormModal}

        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >

        <CustomScrollbarBox sx={style}>
          <Box display={'flex'} alignItems={"center"} justifyContent={"space-between"}>
            <Typography>Add Account</Typography>
            <IconButton color='error' onClick={handleOpenFormModal}>
              <MdClose />
            </IconButton>
          </Box>
          <ExpenseForm submit={submit} initialValues={initialValues} />
        </CustomScrollbarBox>

      </Modal>
      <Grid container spacing={0.5} >
        <Grid item sm={4} position={'relative'} >
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
                onClick={handleOpenFormModal}
              >
                New
              </Button>
              <DotMenu itemJson={[{ title: 'Refresh', onClick: () => { fetchData(state.lastQuery) }, icon: <IoMdRefreshCircle /> }]} />
            </Stack>
          </Box>
          {state.loadingTransactions && <Box position={'absolute'} top={100} zIndex={2} left={'50%'} display={'flex'} justifyContent={'center'} my={2}> <CircularProgress /></Box>}
          <CustomScrollbarBox maxHeight={`calc(100vh - 136px)`}>
            <List sx={{ bgcolor: theme.palette.background.paper, minHeight: `calc(100vh - 136px)`, overflow: 'auto' }}>
              {state.transactions?.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem
                    disablePadding>
                    <ListItemButton
                      autoFocus={isSelected(item._id)}
                      selected={isSelected(item._id)}
                      onClick={() => pushQuery({ selected: item._id })}
                      sx={{ color: theme.palette.info.light, borderLeft: isSelected(item._id) ? 5 : 0 }}
                    >
                      <ListItemIcon>
                        <BiLock />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.paid_to_account?.account_name}
                        secondary={
                          <Typography color={theme.palette.text.secondary} variant='caption'>{`${item.date_formatted} | ${item.paid_from_account?.account_name}`}
                            < br />
                            <Typography ml={2} variant='caption'>{item.reference && '# '}{item.reference} </Typography>
                            {item.supplier_id && <Typography color={theme.palette.text.secondary} variant='caption'>| Supplier: {item.supplier_id?.user_name} </Typography>}
                          </Typography>}
                      />
                      <ListItemText
                        primary={'BDT ' + item.debit_amount_formatted}
                        primaryTypographyProps={{ align: "right", color: theme.palette.text.primary }}
                      />
                      {item.image && <TiAttachment />}
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
            state.loadingTransactions ?
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
                      <Typography variant='h6' fontWeight={'500'}  >Expanse Details</Typography>
                    </Box>
                    <IconButton onClick={() => pushQuery({ selected: undefined })}>
                      <RiCloseLine />
                    </IconButton>
                  </Box>
                  {/* top header ====<<< */}



                  <CustomScrollbarBox bgcolor={theme.palette.background.paper} maxHeight={`calc(100vh - 136px)`}>
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

                    {/* transaction Body ====>>> */}
                    <Grid container spacing={5} p={2} pt={5} minHeight={`calc(100vh - 300px)`}  >
                      <Grid item xs={4}>
                        <Box   >
                          <Typography >Expense Amount</Typography>
                          <Box display={'flex'} gap={1} alignItems={'baseline'}>
                            <Typography
                              fontWeight={'800'}
                              fontSize={24}
                              color={theme.palette.error.light}
                            >
                              {selected.debit_amount_formatted}
                            </Typography>
                            <Typography>on {selected.date_formatted}</Typography>
                          </Box>
                          <Typography mb={5}>{selected.status}</Typography>
                          {selected.description && <Typography >Descriptions: {selected.description}</Typography>}
                          <Box display={'inline'}>
                            <Typography variant='subtitle1' sx={{ bgcolor: theme.palette.background.default, px: 3, p: 2, my: 5 }}>{selected.paid_to_account.account_name}</Typography>
                          </Box>
                          <Box>
                            <Typography >Paid Thought</Typography>
                            <Typography >{selected.paid_from_account?.account_name}</Typography>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          {selected.supplier_id && <Box>
                            <Typography >Supplier</Typography>
                            <Typography >{selected.supplier_id?.user_name}</Typography>
                          </Box>}

                        </Box>
                      </Grid>
                      <Grid xs={8} item display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Box borderRadius={2}
                          component={ButtonBase}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          boxShadow={5} px={3} py={8} display={'flex'} flexDirection={'row'}>
                          {imgUrl || selected.image ?
                            <Image src={imgUrl || `${selected.image}`} width={150} height={150} alt='h' />
                            :
                            <Box>
                              <Box textAlign={"center"} >
                                <Typography color={'Highlight'} fontSize={40}> <RiImageAddFill /></Typography>
                              </Box>
                              <Typography>Drag or Drop Your Receipts</Typography>
                              <Typography variant='caption'>Maximum file size allowed is 1MB</Typography>
                              <Stack mt={3}>

                                <Button startIcon={<MdOutlineFileUpload />}
                                  component="label" size={'small'} color="secondary"
                                  variant='contained'

                                >
                                  Upload Your File
                                  <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                  />
                                </Button>
                              </Stack>
                            </Box>}
                        </Box>

                      </Grid>

                    </Grid>
                    <Divider />
                    <Box p={3}>
                      <Typography >Journals</Typography>
                      <Table sx={{ width: '100%', mb: 5 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Account</TableCell>
                            <TableCell>Debit</TableCell>
                            <TableCell>Credit</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Link component={NextLink} href={`/v2/chart_of_accounts/list/query?selected=${selected.paid_to_account._id}`}>
                                {selected.paid_to_account.account_name}
                              </Link></TableCell>
                            <TableCell>{selected.credit_amount_formatted}</TableCell>
                            <TableCell>{selected.debit_amount_formatted}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Link component={NextLink} href={`/v2/chart_of_accounts/list/query?selected=${selected.paid_from_account?._id}`}>
                                {selected.paid_from_account?.account_name}
                              </Link></TableCell>
                            <TableCell>{selected.debit_amount_formatted}</TableCell>
                            <TableCell>{selected.credit_amount_formatted}</TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell></TableCell>
                            <TableCell sx={{ color: theme.palette.info.light, fontWeight: '800' }}>{selected.debit_amount_formatted}</TableCell>
                            <TableCell sx={{ color: theme.palette.info.light, fontWeight: '800' }}>{selected.debit_amount_formatted}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
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



