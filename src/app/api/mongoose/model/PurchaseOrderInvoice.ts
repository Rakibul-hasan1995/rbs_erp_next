import mongoose, { Schema, Model } from 'mongoose';

interface PurchaseOrderInvoiceDocument extends mongoose.Document {
   supplier: mongoose.Types.ObjectId;
   date: Date;
   invoice_no: string;
   supplier_bill_no: number;
   discount: number;
   amount: number;
   status: string;
   supplier_prev_deu?: number;
   items: string[];
   remarks?: string;
   cover_photo: mongoose.Types.ObjectId;
}

const purchaseInvoiceSchema = new Schema<PurchaseOrderInvoiceDocument>(
   {
      supplier: {
         type: Schema.ObjectId,
         required: true,
         ref: 'User'
      },
      date: {
         type: Date,
         required: true
      },
      invoice_no: {
         type: String,
         required: true,
         unique: true
      },
      supplier_bill_no: {
         type: Number,
         required: true
      },
      discount: Number,
      amount: {
         type: Number,
         required: true
      },
      status: String,
      supplier_prev_deu: {
         type: Number,
         default: 0
      },
      items: [{
         type: Schema.ObjectId,
         ref: 'PurchaseOrder'
      }],
      cover_photo: {
         type: Schema.ObjectId,
         ref: 'Gallery'
      },
      remarks: String
   },
   {
      timestamps: true,
      id: true
   }
);
// userSchema.index({ email: 'text' });
const PurchaseOrderInvoice = mongoose.models.PurchaseOrderInvoice || mongoose.model('PurchaseOrderInvoice', purchaseInvoiceSchema);


export { PurchaseOrderInvoice };



