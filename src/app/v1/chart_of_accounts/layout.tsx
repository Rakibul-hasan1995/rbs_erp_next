import { ChartOfAccountProvider } from '@/v1/context/chartOfAccountProvider';
import React from 'react';

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
