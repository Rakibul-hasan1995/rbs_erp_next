
import React from 'react';
import { ChartOfAccountProvider } from './chartOfAccountProvider';

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   return (
      <ChartOfAccountProvider>
         {children}
      </ChartOfAccountProvider>
   )
}
