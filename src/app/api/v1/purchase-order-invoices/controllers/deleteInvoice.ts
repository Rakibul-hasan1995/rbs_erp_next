// import { NextFunction, Request, Response } from "express";
// import { Trash } from "../../../../model/Trash";
// import { PurchaseOrderInvoice } from "../../../../model/PurchaseOrderInvoice";

// export const deletePurchaseOrderInvoice = async (req: Request, res: Response, next: NextFunction) => {
//    try {
//       const id = req.params._id
//       const invoice = await PurchaseOrderInvoice.findById(id)
//       if (!invoice) {
//          return res.status(400).json({
//             code: 400, data: { filed: '_id', value: 'invoice Not Found' }, message: 'invoice Not Found'
//          })
//       }
//       let trash = new Trash({
//          _id: invoice._id,
//          data: JSON.stringify(invoice),
//          collectionName: 'purchaseOrderInvoice'
//       })
//       const suc = await trash.save()
//       const del = await invoice.deleteOne()
//       res.status(200).json({
//          "code": 200,
//          "message": "Successfully delete Data"
//       })
//    } catch (error) {
//       next(error)
//    }
// }