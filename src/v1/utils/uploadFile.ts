import { serverUrl } from "./axios-config";

// https://api.cloudinary.com/v1_1/dbu76a0wo/image/upload (ml_preset)
const isBrowser = typeof window !== 'undefined';
const authToken = `Bearer ${isBrowser && localStorage.getItem("access_token")}`

interface UploaderResponse {
   success: boolean;
   data: any;
   error: any | null;
}


async function uploader(formData: FormData, item?: 1 | 'many'): Promise<UploaderResponse> {
   const res = await fetch(`${serverUrl}/api/v1/upload/${item == 1 ? 'single' : 'multiple'}`, {
      method: 'POST',
      headers: {
         'authorization': authToken,
      },
      body: formData
   });
   if (res.ok) {
      const data = await res.json()


      return { success: true, data: data, error: null }
   } else {
      const error = await res.json()
      return { success: false, data: null, error: error }
   }
}
export { uploader }