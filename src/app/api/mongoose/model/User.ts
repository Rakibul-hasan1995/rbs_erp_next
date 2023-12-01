import mongoose, { Schema, Model } from 'mongoose';
import { userRolls } from './appConfig';

interface Contact {
  address: string;
  phone: string;
  contactParsonName: string;
}

export interface UserDocument extends mongoose.Document {
  email: string;
  user_name: string;
  roll: 'user' | 'customer' | 'supplier' | 'admin' | 'super-admin';
  password?: string;
  contact_details: Contact;
  opening_balance?: number;
  exchange_rate?: number
}


const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    user_name: {
      type: String,
      required: true
    },
    roll: {
      type: String,
      enum: userRolls,
      default: 'customer',
    },
    opening_balance: {
      type: Number,
    },
    password: String,
    contact_details: {
      address: String,
      phone: String,
      contactParsonName: String
    },
    exchange_rate: {
      type: Number,
      default: 85
    }
  },
  {
    timestamps: true,
    id: true
  }
);

// mongoose.deleteModel('User');
// userSchema.index({ email: 'text' });
const User = mongoose.models.User || mongoose.model('User', userSchema);



export { User };