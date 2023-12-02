import mongoose, { Schema, Model } from 'mongoose';
import { collections } from './appConfig';

interface TrashDocument extends mongoose.Document {
  data: string;
  descriptions?: string;
  collectionName: string; // Change the type to string
}


const trashSchema = new Schema<TrashDocument>(
  {
    data: {
      type: String,
      required: true
    },
    descriptions: String,
    collectionName: {
      type: String,
      enum: collections,
      required: true
    }
  },
  {
    timestamps: true,
    id: true
  }
);
// userSchema.index({ email: 'text' });
const Trash: Model<TrashDocument> = mongoose.models.Trash  || mongoose.model<TrashDocument>('Trash', trashSchema);


export { Trash };



