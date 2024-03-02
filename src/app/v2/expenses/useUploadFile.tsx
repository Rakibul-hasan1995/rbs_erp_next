import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export function useUploadTransactionFile() {
   const [imgUrl, setImgUrl] = useState('');

   const handleFileChange = (e: any) => {
      if (e.target.files.length) {
         setImgUrl(URL?.createObjectURL(e.target.files[0]));
         uploading(e.target.files[0])
      }
   };
   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setImgUrl(URL.createObjectURL(droppedFiles[0]));
      uploading(droppedFiles[0])
   };


   const uploading = async (file: any) => {
      try {
         const formData = new FormData()
         formData.append('file', file)


         const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME

         formData.append('upload_preset', 'rqys3beg')
         const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, formData)
         if (res.status == 200) {
            return { success: true, data: res.data, error: null }
         } else {
            return toast.error('File Upload Failed')
         }

      } catch (error) {
         console.log(error)
      }
   }

   return { handleDrop, handleFileChange, imgUrl }
}
