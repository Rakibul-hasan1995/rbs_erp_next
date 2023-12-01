import mongoose, { Schema, Model } from 'mongoose';
import { shifts } from './appConfig';
export interface ProductionDataDocument extends mongoose.Document {
   order: mongoose.Types.ObjectId;
   qty: number;
   machine_no: number;
   operator: mongoose.Types.ObjectId;
   assistant_operator?: mongoose.Types.ObjectId;
   remarks?: string;
}
interface ProductionDocument extends mongoose.Document {
   date: Date;
   shift: string;
   total_amount: number
   production_data: [ProductionDataDocument]
}

const productionDataSchema = new Schema<ProductionDataDocument>(
   {
      order: {
         type: Schema.ObjectId,
         ref: 'Order',
         required: true,
      },
      machine_no: {
         type: Number,
         required: true
      },
      qty: { type: Number, default: 0 },
      operator: {
         type: Schema.ObjectId,
         ref: 'User',
         required: true,
      },
      assistant_operator: {
         type: Schema.ObjectId,
         ref: 'User',
         default: new mongoose.Types.ObjectId()
      },

      remarks: String
   }, {
   _id: true
}

);

const productionSchema = new Schema<ProductionDocument>(
   {
      date: {
         type: Date,
         required: true
      },
      shift: {
         type: String,
         enum: shifts,
         required: true
      },
      total_amount: {
         type: Number
      },
      production_data: [productionDataSchema]
   },
   {
      timestamps: true,
      id: true
   }
);
// userSchema.index({ email: 'text' });

const Production = mongoose.models.Production || mongoose.model('Production', productionSchema);


export { Production };



