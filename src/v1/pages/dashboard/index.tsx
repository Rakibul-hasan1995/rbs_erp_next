'use client'
import { Box, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import XYChart from './XYChart'
import { useThemeContext } from '@/v1/context/themeContext'


export default function Dashboard() {
   const { setTitle } = useThemeContext()
   useEffect(() => {
      setTitle("Dashboard")
      return () => {
         setTitle("RBS")
      }
   }, [])

   return (
      <Box>
         <Grid container gap={1}>
            <Grid item xs={11} sm={6}><XYChart path='invoices' title='Invoices' /></Grid>
            <Grid item xs={11} sm={5.9}><XYChart path='payments' title='Payments' /></Grid>
            <Grid item xs={11} sm={5.9}><XYChart path='productions' title='Productions' /></Grid>
         </Grid>
      </Box>
   )
}
