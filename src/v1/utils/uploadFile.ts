import axios from "axios";
interface UploaderResponse {
   success: boolean;
   data: any;
   error: any | null;
}

async function uploader(formData: FormData): Promise<UploaderResponse> {

   const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME

   formData.append('upload_preset', 'rqys3beg')
   const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, formData)
   if (res.status == 200) {
      return { success: true, data: res.data, error: null }
   } else {
      return { success: false, data: null, error: res.data }
   }

}
export { uploader }