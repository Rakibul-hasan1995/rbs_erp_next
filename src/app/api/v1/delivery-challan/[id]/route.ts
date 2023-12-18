
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { DeliveryChallan } from "@/app/api/mongoose/model/Challan"
import dbConnect from "@/app/api/mongoose/mongoose"
import { getChallanById } from "../../receive-challans/controllers/getChallanById"
import { updateChallan } from "../../receive-challans/controllers/updateChallan"
import { deleteChallanById } from "../../receive-challans/controllers/deleteChallan"
import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"
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
      const expand = getQueryParams(request.url as string, 'expand', false)
      const data = await getChallanById(DeliveryChallan, id, expand)
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
      const data = await updateChallan(DeliveryChallan, id, body)
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
      const data = await deleteChallanById(DeliveryChallan, id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


