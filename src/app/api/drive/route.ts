import { NextResponse } from "next/server"
// import handler from "./handler"
import { drive } from "./apiClient"
import { NextApiRequest, NextApiResponse } from "next"
import handler from "./handler"

export const POST = async (req: Request) => {
   // const res = await emailHandler()
   const file = await req.formData()

   const res = await handler(file)

   return NextResponse.json({ status: 200 })
}



export const GET = async (req: Request) => {
   try {
      const fileId = '1M4BZ7rifMjfM3Jw-nap8ub1JrDWirYX9'

      const response = await drive.files.get({
         fileId,
         alt: 'media', // Use 'media' to download the file content
      }, {
         responseType: 'stream', // Use 'stream' to handle large files
      });


      return NextResponse.json({ response }, { status: 200 })

   } catch (error: any) {
      console.error('Error downloading file:', error.message);
      return NextResponse.json({ message: 'something went wrong' }, { status: 500 })

      // return res.status(500).json({ error: 'Internal Server Error' });
   }
}



// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//    try {
//       const fileId = '1M4BZ7rifMjfM3Jw-nap8ub1JrDWirYX9';

//       const response: any = await drive.files.get({
//          fileId,
//          alt: 'media', // Use 'media' to download the file content
//       }, {
//          responseType: 'stream', // Use 'stream' to handle large files
//       });

//       res.setHeader('Content-Type', response.headers['content-type']);
//       res.setHeader('Content-Disposition', `attachment; filename=${response.data.name}`);

//       response.data.pipe(res);
//    } catch (error: any) {
//       console.error('Error downloading file:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//    }
// }