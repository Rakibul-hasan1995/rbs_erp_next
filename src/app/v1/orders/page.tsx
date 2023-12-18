import React from 'react'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { redirect } from 'next/navigation'
import ReportsOrder from './list'
export default async function page() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }
  const image = JSON.parse(session?.user?.image || '')
  if (image.roll == 'user') {
    redirect('/v1/user/orders')
  }

  return (
    <ReportsOrder />
  )
}
