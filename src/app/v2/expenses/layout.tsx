import { TransactionProvider } from '@/app/v2/expenses/TransactionProvider';

import React from 'react';

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   return (
      <TransactionProvider>
         {children}
      </TransactionProvider>
   )
}
