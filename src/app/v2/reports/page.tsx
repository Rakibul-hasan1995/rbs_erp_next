import { Box, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import { BiSolidShoppingBag } from 'react-icons/bi'
import { GiMoebiusStar } from 'react-icons/gi'

export default function Page() {
  return (
    <Box p={3}>
      <Grid container spacing={10}>
        <Grid item >
          <Typography>
            <BiSolidShoppingBag />  Purchase And Expenses
          </Typography>
          <Link underline='none' fontSize={13} component={NextLink} href={'reports/expenses-by-category'}> <GiMoebiusStar /> Expenses By Category</Link>
        </Grid>
        <Grid item>
          <Typography>
            <BiSolidShoppingBag />  Customers
          </Typography>
          <Link underline='none' fontSize={13} component={NextLink} href={'reports/customers/customer-balance-summary'}> <GiMoebiusStar /> Customer Balance Summary</Link>
        </Grid>
        <Grid item>

        </Grid>
        <Grid item>

        </Grid>

      </Grid>

    </Box>
  )
}


