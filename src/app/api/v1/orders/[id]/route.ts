import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { cloneOrder } from "../controllers/clone"
import { getOrderById } from "../controllers/getOrderById"
import { updateOrder } from "../controllers/updateOrder"
import dbConnect from "@/app/api/mongoose/mongoose"
import { deleteOrder } from "../controllers/deleteOrder"
import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"
import { NextResponse } from "next/server"






export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await cloneOrder(id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {

   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const body = await request.json()
      const id = params.id
      const data = await updateOrder(id, body)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function GET(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const isExpand = getQueryParams(request.url as string, 'expand', false)
      const id = params.id
      const data = await getOrderById(id, isExpand)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await deleteOrder(id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}