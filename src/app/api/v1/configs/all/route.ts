
import { itemUnits, currency, orderCategory, orderStatus, collections, shifts, userRolls, invoiceStatus, payment_modes, account_type } from "@/app/api/mongoose/model/appConfig"





import { NextResponse } from "next/server"




export const GET = async () => {
   try {
      const response = {
         itemUnits: itemUnits,
         currency: currency,
         orderCategory: orderCategory,
         orderStatus: orderStatus,
         collections: collections,
         shifts: shifts,
         userRolls: userRolls,
         payment_modes: payment_modes,
         invoice_status: invoiceStatus,
         account_type
      }
     return NextResponse.json(response, {status: 200})

   } catch (error: any) {
      return NextResponse.json(error)
   }
}
