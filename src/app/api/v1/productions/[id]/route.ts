
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { getProductionById } from "../controllers/getProductionById"
import { NextResponse } from "next/server"
import { updateProduction } from "../controllers/updateProduction"
import dbConnect from "@/app/api/mongoose/mongoose"
import { deleteProduction } from "../controllers/deleteProduction"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const expand = getQueryParams(request.url as string, 'expand', false)
   const res = await getProductionById(id, expand)
   return NextResponse.json(res, { status: res.code })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const res = await updateProduction(id, body)
   return NextResponse.json(res, { status: res.code })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const res = await deleteProduction(id)
   return NextResponse.json(res, { status: res.code })
}





// router.delete("/:_id", admin_checker, deleteProduction);
