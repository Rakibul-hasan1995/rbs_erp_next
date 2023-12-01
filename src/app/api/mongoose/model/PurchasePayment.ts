import mongoose, { Schema, Model, Date } from 'mongoose';
import { currency, itemUnits, orderCategory, orderStatus, payment_modes } from './appConfig';
import moment from 'moment';



type Status = typeof orderStatus[number];


interface PurchasePaymentDocument extends mongoose.Document {
   supplier: Schema.Types.ObjectId;
   date?: string;
   receipt_no: string;
   invoice?: Schema.Types.ObjectId;
   received_by?: string;
   amount: number;
   payment_mode: string;
   supplier_prev_deu: number;
   description?: string;
   cheque_info?: {
      cheque_date?: string;
      bank_name: string;
      branch_name: string;
      cheque_no: string;
      image?: string
   };
}

const purchasePaymentSchema = new Schema<PurchasePaymentDocument>(
   {
      supplier: {
         type: Schema.ObjectId,
         ref: 'User',
         required: true,
      },
      date: {
         type: Date,
         required: true
      },
      receipt_no: {
         type: String,
         required: true
      },
      invoice: {
         type: Schema.ObjectId,
         ref: 'invoice'
      },
      received_by: {
         type: String,
         default: 'Author'
      },
      amount: {
         type: Number,
         required: true
      },
      payment_mode: {
         type: String,
         enum: payment_modes,
         default: 'Cash'
      },
      supplier_prev_deu: {
         type: Number,
         default: 0
      },
      description: {
         type: String,
         default: ''
      },
      cheque_info: {
         cheque_date: Date,
         bank_name: String,
         branch_name: String,
         cheque_no: String,
         image: String
      }
   },
   {
      timestamps: true,
      id: true
   }
);
// purchasePaymentSchema.index({ email: 'text' });
const PurchasePayment = mongoose.models.PurchasePayment || mongoose.model('PurchasePayment', purchasePaymentSchema);



export { PurchasePayment };