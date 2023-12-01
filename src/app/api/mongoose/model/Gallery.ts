import mongoose, { Schema, Model } from 'mongoose';

interface GalleryDocument extends mongoose.Document {
  tags?: string[];
  href: string;
  name?: string;
}


const gallerySchema = new Schema<GalleryDocument>(
  {
    name: {
      type: String,
    },
    href: {
      type: String,
      required: true
    },
    tags: {
      type: [String]
    }
  },
  {
    timestamps: true,
    id: true
  }
);

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);




export { Gallery };





