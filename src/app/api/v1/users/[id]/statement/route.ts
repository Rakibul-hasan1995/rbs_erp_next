import dbConnect from "@/app/api/mongoose/mongoose"
import { getStatementByUserId } from "../../controllers/generateCustomerStatement"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id // 'a', 'b', or 'c'
   const res = await getStatementByUserId(id)
   // return Response.json({})
   return Response.json(res, { status: res.code })
}