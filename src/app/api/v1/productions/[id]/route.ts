
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { getProductionById } from "../controllers/getProductionById"
import { NextResponse } from "next/server"
import { updateProduction } from "../controllers/updateProduction"
import dbConnect from "@/app/api/mongoose/mongoose"
import { deleteProduction } from "../controllers/deleteProduction"
import { checkLogger } from "@/app/api/auth/checkLogger"

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
      const res = await getProductionById(id, expand)
      return NextResponse.json(res, { status: res.code })
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
      const res = await updateProduction(id, body)
      return NextResponse.json(res, { status: res.code })
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
      const res = await deleteProduction(id)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}





// router.delete("/:_id", admin_checker, deleteProduction);
