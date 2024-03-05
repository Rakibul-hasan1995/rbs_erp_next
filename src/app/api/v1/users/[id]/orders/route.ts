import dbConnect from "@/app/api/mongoose/mongoose"
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import mongoose from 'mongoose'
import { queryOrder } from "../../../orders/controllers/helpers/queryOrder"
import { NextResponse } from "next/server"
import { authorized } from "@/app/api/auth/authorized"

export async function GET(request: Request, { params }: { params: { id: string } }) {

   const user = await authorized()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const id = params.id // 'a', 'b', or 'c'
   const url = request.url

   const searchTerm = getQueryParams(url, 'search', undefined)
   const searchBy = getQueryParams(url, 'search_by', undefined)

   const regex = new RegExp(searchTerm, 'i')
   let filter = {}
   if (searchBy && searchTerm) {
      filter = { [searchBy]: { $regex: regex } }
   }
   if (searchTerm && !searchBy) {
      filter = {
         $or: [
            { program_name: { $regex: regex } },
            { order_name: { $regex: regex } },
         ],
      }
   }
   const query = {
      $and: [
         { customer: new mongoose.Types.ObjectId(id) },
         { ...filter }
      ]
   }

   const res = await queryOrder(url, query)
   return Response.json(res, { status: res.code })



}