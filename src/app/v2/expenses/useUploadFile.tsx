import { uploader } from "@/v1/utils/uploadFile";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTransactionContext } from "./TransactionProvider";

export default function useUploadTransactionFile() {
   const [imgUrl, setImgUrl] = useState('');
   const searchParams = useSearchParams()
   const id = searchParams.get('selected')

   const { updateTransaction } = useTransactionContext()

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
         const fileData = new FormData()
         fileData.append('file', file)


         // const { data, success } = await uploader(fileData)



         const { data, success } = await toast.promise(
            uploader(fileData),
            {
               loading: 'Uploading File...',
               success: <b>Upload Success</b>,
               error: <b>Upload Error.</b>
            }
         )

         if (!success) {
            return toast.error('File Upload Failed')
         }
         const url = data.secure_url
         updateTransaction(`${id}`, { image: url })

      } catch (error) {
         console.log(error)
      }
   }



   return { handleDrop, handleFileChange, imgUrl }
}
