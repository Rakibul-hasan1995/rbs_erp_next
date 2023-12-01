import mongoose, { Schema, Model } from 'mongoose';
import { currency, itemUnits, orderCategory, orderStatus } from './appConfig';



type Status = typeof orderStatus[number];


interface OrderDocument extends mongoose.Document {
  customer: Schema.Types.ObjectId;
  order_name: string;
  program_name?: string;
  qty: number;
  rate: number;
  currency: string;
  unit: string;
  stitching?: number;
  category?: string;
  tags?: string[];
  description?: string;
  order_date?: string;
  shipment_date?: string;
  status: Status;
  image_gallery?: Schema.Types.ObjectId[];
  cover_photo: Schema.Types.ObjectId;
}

const orderSchema = new Schema<OrderDocument>(
  {
    customer: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    order_name: {
      type: String,
      required: true
    },
    program_name: {
      type: String,
      default: ''
    },
    qty: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: currency,
      default: 'BDT'
    },
    unit: {
      type: String,
      enum: itemUnits,
      default: 'Pcs'
    },
    stitching: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: orderCategory,
      default: 't-shirt'
    },
    tags: {
      type: [String],
      default: 'Design'
    },
    status: {
      type: String,
      default: 'placed'
    },
    description: String,
    order_date: {
      type: Date,
      default: new Date()
    },
    shipment_date: {
      type: Date,
      default: new Date()
    },
    image_gallery: [{ type: Schema.ObjectId, ref: 'Gallery' }],
    cover_photo: {
      type: Schema.ObjectId,
      ref: 'Gallery'
    }
  },
  {
    timestamps: true,
    id: true
  }
);
// orderSchema.index({ email: 'text' });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);


export { Order };