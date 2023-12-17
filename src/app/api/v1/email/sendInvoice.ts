// pages/api/send-email.js
import nodemailer from "nodemailer";
import { renderToStaticMarkup } from 'react-dom/server';

export default async function emailHandler(file: FormData) {
   try {
      // Your email sending logic here
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.EMAIL_NODEMAILER,
            pass: process.env.EMAIL_PASSWORD_NODEMAILER,
         },
      });

      
      const blob: any = file.get('file')
      const buffer = Buffer.from(await blob.arrayBuffer());
      const mailOptions = {
         from: process.env.EMAIL_NODEMAILER,
         to: "monapygroup@gmail.com",
         subject: "Subject of the email",
         text: "Body of the email",
         attachments: [
            {
               filename: 'fileName.pdf',
               type: "application/pdf",
               content: buffer
            },
         ],
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
   } catch (error) {
      console.error("Email sending error:", error);
      return { success: false, massage: "Internal server error" };
   }
}