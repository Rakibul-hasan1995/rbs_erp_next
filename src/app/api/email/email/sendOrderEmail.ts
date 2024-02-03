
// import nodemailer from 'nodemailer'
// import fs from "fs";
// import path from "path";
// const file = './orderEmailTamp.html'
// const htmlTemplate = fs.readFileSync(path.resolve(file), 'utf-8');

// export async function sendNewNewOrderEmail(orderData: any) {
//    const { customer, _id: orderId, program_name, order_name, qty, rate } = orderData;

//    const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//          user: process.env.EMAIL_NODEMAILER,
//          pass: process.env.EMAIL_PASSWORD_NODEMAILER,
//       },
//    });

//    const mailOptions = {
//       from: 'your@example.com',
//       to: 'info.monpay@gmail.com',
//       subject: 'New Order Notification',
//       html: htmlTemplate.replace(/{{ customerName }}/g, customer.user_name)
//          .replace(/{{ orderId }}/g, orderId)
//          .replace(/{{ program_name }}/g, "# " + program_name)
//          .replace(/{{ order_name }}/g, order_name)
//          .replace(/{{ quantity }}/g, qty)
//          .replace(/{{ rate }}/g, rate)
//          .replace(/{{ link }}/g, `<a href="https://rbs-erp-next.vercel.app/v1/orders/profile/${orderId}">View Order</a>`)
//    };

//    try {
//       await transporter.sendMail(mailOptions);
//       console.log('send email success')
//    } catch (error) {
//       console.error('Error sending email: ', error);
//    }
// }

