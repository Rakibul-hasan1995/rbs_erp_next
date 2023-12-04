import mongoose, { Schema, Model, Date } from 'mongoose';
import { orderStatus, payment_modes } from './appConfig';



type Status = typeof orderStatus[number];


interface PurchaseOrderDocument extends mongoose.Document {
   supplier: Schema.Types.ObjectId;
   order: Schema.Types.ObjectId;
   order_date?: string;
   qty: number;
   rate: number;
   description: string;
   shipment_date?: string;
   status: Status
}

const purchaseOrderSchema = new Schema<PurchaseOrderDocument>(
   {
      supplier: {
         type: Schema.ObjectId,
         ref: 'User',
         required: true,
      },
      order: {
         type: Schema.ObjectId,
         ref: 'Order',
         required: true,
      },
      order_date: {
         type: Date,
         required: true
      },
      shipment_date: {
         type: Date,
         required: true
      },
      qty: {
         type: Number,
         required: true
      },
      rate: {
         type: Number,
         required: true
      },
      description: {
         type: String,
         required: false
      },
      status: {
         type: String,
         enum: orderStatus,
         default: 'placed'
      },
   },
   {
      timestamps: true,
      id: true
   }
);
const PurchaseOrder:  Model<PurchaseOrderDocument> = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);



export { PurchaseOrder };