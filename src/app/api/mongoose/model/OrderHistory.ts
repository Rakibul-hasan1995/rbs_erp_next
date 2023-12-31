import mongoose, { Model, Schema } from "mongoose";

interface HistoryDocument extends mongoose.Document {
   parentId: Schema.Types.ObjectId;
   title: string;
   massage: string;
   snapshot: any,
   data: any
}


const historySchema = new Schema<HistoryDocument>(
   {
      parentId: {
         type: Schema.ObjectId,
         required: true,
      },
      title: {
         type: String,
         required: true
      },
      massage: {
         type: String,
      },
      data: {
         type: Object
      },

      snapshot: {
         type: Object,
      },
   },
   {
      timestamps: true,
      id: true
   }
);

const History = mongoose.models.History || mongoose.model('History', historySchema);

export { History };

