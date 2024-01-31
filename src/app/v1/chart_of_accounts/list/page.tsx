'use client'
import COAListTopMenu from '@/v1/components/chartOfAccount/list/topMenu';
import { useChartOfAccountContext } from '@/v1/context/chartOfAccountProvider';
import { Box, Button, CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@mui/material'
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

export const CustomScrollbarBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: '0.5em'
  },
  '&::-webkit-scrollbar-track': {
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.10)',

  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    // outline: '1px solid slategrey',
    width: '0.1em',
    borderRadius: 10
  },
  overflow: 'auto',
});


export default function Page() {
  const { state, setState, fetchDataById } = useChartOfAccountContext()
  const theme = useTheme()
  return (
    <Box>
      <Grid container >
        <Grid item sm={4} boxShadow={1} >
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
                    <IconButton color='info' >
                      <HiOutlineDotsHorizontal />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </Box>
          <CustomScrollbarBox maxHeight={`calc(100vh - 171px)`}>
            <List sx={{ bgcolor: theme.palette.background.paper, minHeight: `calc(100vh - 171px)`, overflow: 'auto' }}>
              {state.accounts?.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => fetchDataById(item._id)}

                      sx={{ color: 'Highlight', }} >
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
                      <Typography fontWeight={'500'}  >{state.account.account_name}</Typography>
                    </Box>
                    <IconButton onClick={() => setState((prev) => ({ ...prev, account: undefined }))}>
                      <RiCloseLine />
                    </IconButton>
                  </Box>
                  {/* top header ====<<< */}

                  {/* edit row ====>>> */}
                  <Box>
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

                  <Box>
                    {/* info row ====>>> */}
                    <Box p={2} borderBottom={'3px dashed'} >
                      <Typography >Closing Balance</Typography>
                      <Typography variant='h4' >BDT {numberWithCommas(state.account.closing_balance)}</Typography>
                      <Typography component={"i"} >Description: <Typography>{state.account.description}</Typography></Typography>

                    </Box>
                    {/* info row ====<<< */}

                    {/* transaction Body ====>>> */}
                    <Box bgcolor={theme.palette.background.paper} display={'flex'} minHeight={'100%'} width={'100%'}  >
sdf

                    </Box>
                    {/* transaction Body ====<<< */}



                  </Box>


                </Box>
                :
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
          }
        </Grid>

      </Grid>

    </Box>
  )
}
