import dbConnect from "@/app/api/mongoose/mongoose"
import { updateInvoice } from "../controllers/updateInvoice"
import { getInvoiceById } from "../controllers/getInvoiceById"
import { getQueryParams } from "@/app/api/lib/getQueryParams"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updateInvoice(id, body)
   return Response.json(data, { status: data.code })
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const expand = getQueryParams(request.url as string, 'expand', false)
   const data = await getInvoiceById(id, expand)
   return Response.json(data, { status: data.code })
}


// router.get("/:_id", admin_checker, getInvoiceById);
// router.delete("/:_id", admin_checker, deleteInvoice);
