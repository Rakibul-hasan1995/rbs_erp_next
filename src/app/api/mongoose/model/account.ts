import mongoose, { Schema, Model } from 'mongoose';


interface AccountDocument {
  account_name: string;
  account_type: "Cash" | 'Expenses' | 'Income' | 'Liability' | "Asset";
  is_debit: boolean;
  is_system_account: boolean;
  status: 'active' | 'inactive';
  description?: string;
  createdBy: mongoose.Types.ObjectId
}

type AccDocument = AccountDocument & mongoose.Document
const schema = new Schema<AccDocument>(
  {
    account_name: {
      type: String,
      required: true
    },
    account_type: {
      type: String,
      enum: ['Expenses', 'Income', 'Liability', "Asset"],
      required: true,
    },
    is_system_account: {
      type: Boolean,
      required: true,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true
    },
    description: {
      type: String,
      required: false
    },
    is_debit: {
      type: Boolean,
      required: true,
      default: true
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
    id: true
  }
);
// userSchema.index({ email: 'text' });
const Account: Model<AccDocument> = mongoose.models.Account || mongoose.model<AccDocument>('Account', schema);


export { Account };



