// import { Invoice } from "@/app/api/mongoose/model/Invoice"
// import { Trash } from "@/app/api/mongoose/model/Trash"

// export const deleteInvoice = async (id: string,) => {
//    try {

//       const invoice = await Invoice.findById(id)
//       if (!invoice) {
//          return {
//             code: 400, data: { filed: '_id', value: 'invoice Not Found' }, message: 'invoice Not Found'
//          }
//       }
//       let trash = new Trash({
//          _id: invoice._id,
//          data: JSON.stringify(invoice),
//          collectionName: 'invoice'
//       })
//       const suc = await trash.save()
//       const del = await invoice.deleteOne()
//       return {
//          "code": 200,
//          "message": "Successfully delete Data"
//       }
//    } catch (error: any) {
//       return {
//          error,
//          code: 500,
//          message: error.message
//       }
//    }
// }