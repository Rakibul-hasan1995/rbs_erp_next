import React from 'react';
import UiLayout from './ui_layout';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const session = await getServerSession(authOptions)
   if (!session) {
      redirect('/auth/signin')
   }

   return (
      <UiLayout>
         {children}
      </UiLayout>
   )
}
