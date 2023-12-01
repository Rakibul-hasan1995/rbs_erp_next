import mongoose, { Schema, Model } from 'mongoose';

interface InvoiceDocument extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  cover_photo: mongoose.Types.ObjectId;
  date: Date;
  invoice_no: string;
  customer_bill_no: number;
  discount: number;
  amount: number;
  status: string;
  customer_prev_deu?: number;
  items: string[];
  remarks?: string;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    customer: {
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
    customer_bill_no: {
      type: Number,
      required: true
    },
    discount: Number,
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'Created'
    },
    customer_prev_deu: {
      type: Number,
      default: 0
    },
    cover_photo: {
      type: Schema.ObjectId,
      ref: 'Gallery'
    },
    items: [{
      type: Schema.ObjectId,
      ref: 'Order'
    }],
    remarks: String
  },
  {
    timestamps: true,
    id: true
  }
);
// userSchema.index({ email: 'text' });

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);


export { Invoice };



