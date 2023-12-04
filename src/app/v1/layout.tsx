import React from 'react';
import UiLayout from './ui_layout';
export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   // const session = await getServerSession(authOptions)
   // if (!session) {
   //    redirect('/auth/signin')
   // }

   return (
      <UiLayout>
         {children}
      </UiLayout>
   )
}
