
import React from 'react';
import { CustomerProvider } from './context';

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   return (
      <CustomerProvider>
         {children}
      </CustomerProvider>
   )
}
