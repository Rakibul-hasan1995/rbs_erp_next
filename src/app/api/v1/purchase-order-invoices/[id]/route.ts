


import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePurchaseOrderInvoice } from "../controllers/updateInvoice"
import { getPurchaseOrderInvoiceById } from "../controllers/getInvoiceById"
import { getServerSession } from "next-auth"

import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updatePurchaseOrderInvoice(id, body)
   return Response.json(data, { status: data.code })
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
   const session = await getServerSession(authOptions)
   if (!session) {
      return NextResponse.json({message: 'unauthorized'}, {status: 401})
   }

   await dbConnect()
   const id = params.id
   const data = await getPurchaseOrderInvoiceById(id)
   return Response.json(data, { status: data.code })
}
