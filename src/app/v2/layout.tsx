import React from 'react';
import UiLayout from './ui_layout';
export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   return (
      <UiLayout>
         {children}
      </UiLayout>
   )
}
