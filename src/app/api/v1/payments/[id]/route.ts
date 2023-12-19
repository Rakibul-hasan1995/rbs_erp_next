import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePayment } from "../controllers/updatePayment"
import { getPaymentById } from "../controllers/getPaymentById"
import { deletePayment } from "../controllers/deletePayment"
import { checkLogger } from "@/app/api/auth/checkLogger"
import { NextResponse } from "next/server"



export async function GET(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await getPaymentById(id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}



export async function PUT(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const body = await request.json()
      const data = await updatePayment(id, body)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await deletePayment(id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

