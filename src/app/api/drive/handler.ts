import { drive } from './apiClient';


export default async function handler(file: any) {
   try {
      console.log('file')

      const blob: any = file.get('file')
      // const buffer = Buffer.from(blob, 'base64')
      const buffer = Buffer.from(await blob.arrayBuffer(), 'base64');

      const fileMetadata = {
         name: '123.pdf',
         mimeType: 'application/pdf',
      };
      const media = {
         mimeType: 'application/pdf', // Set the MIME type based on your file type
         body: buffer
      };

      const driveResponse = await drive.files.create({
         // resource: fileMetadata,
         media: media,
         fields: 'id',
      });
      console.log({driveResponse})

      const fileId = driveResponse.data.id;
      return { fileId }
   } catch (error: any) {
      console.error('Error uploading file:', error.message);
      return { message: 'Internal Server Error' }
   }
}
