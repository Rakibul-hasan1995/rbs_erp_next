import React from 'react'
import UserList from './List'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { redirect } from 'next/navigation'
export default async function page() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }
  const image = JSON.parse(session?.user?.image || '')
  if (image.roll !== 'admin') {
    redirect('/auth/signin')
  }

  return (
    <UserList />
  )
}
