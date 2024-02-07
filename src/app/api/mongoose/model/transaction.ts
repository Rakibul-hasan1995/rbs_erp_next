import { TransactionRaw } from '@/types/transaction';
import mongoose, { Schema, Model } from 'mongoose';



type TrDocs = mongoose.Document & TransactionRaw


const schema = new Schema<TrDocs>(
   {
      date: {
         type: Date,
         required: true
      },
      account_id: {
         type: Schema.ObjectId,
         ref: 'Account',
         required: false,
      },
      paid_from_account: {
         type: Schema.ObjectId,
         ref: 'Account',
         required: false,
      },
      relative_id: {
         type: Schema.ObjectId,
         ref: 'Transaction',
      },
      paid_to_account: {
         type: Schema.ObjectId,
         ref: 'Account',
         required: false,
      },
      customer_id: {
         type: Schema.ObjectId,
         ref: 'User',
         required: false,
      },
      supplier_id: {
         type: Schema.ObjectId,
         ref: 'User',
         required: false,
      },
      ref_id: [{
         type: Schema.ObjectId,
         ref: 'User',
         required: false,
      }],
      description: String,
      credit_amount: {
         type: Number,
         required: false,
         default: 0
      },
      debit_amount: {
         type: Number,
         required: false,
         default: 0
      },
      type: {
         type: String, // opening balance, settlement, expense, income, invoice, customer payment, transfer , Purchases, 
         enum: ['Opening Balance', "Settlement", "los", "Expense", "Income", "Invoice", "Customer Payment", "Purchases"],
      },
      status: {
         type: String,
      },
      reference: {
         type: String,  // voucher no , invoice no, payment ref, etc
      },
      image: String
   },
   {
      timestamps: true,
      id: true
   }
);
// userSchema.index({ email: 'text' });
const Transaction: Model<TrDocs> = mongoose.models.Transaction ||  mongoose.model<TrDocs>('Transaction', schema);


export { Transaction };

