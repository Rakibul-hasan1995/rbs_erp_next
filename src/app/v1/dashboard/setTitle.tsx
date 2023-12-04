'use client'
import { useEffect } from 'react';

import { useThemeContext } from '@/v1/context/themeContext'

export default function SetTitle() {
   const { setTitle } = useThemeContext()
   useEffect(() => {
      setTitle("Dashboard")
      return () => {
         setTitle("RBS")
      }
   }, [])

   return (
      <></>
   )
}


