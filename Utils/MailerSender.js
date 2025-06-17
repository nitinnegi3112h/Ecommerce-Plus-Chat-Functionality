import nodemailer from "nodemailer"
import dotenv from 'dotenv';
dotenv.config();


const transporter=nodemailer.createTransport(
    {
        secure:true,
        host:"smtp.gmail.com",
        port: 465,
        auth: {
            user:process.env.MAILID,
            pass:process.env.MAIL_PASSWORD
        }
    }
);


export function sendMail(to,sub,msg)
{
     transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
     });
}

export function sendOrderConfirmationMail(user,order)
{
    console.log(user);
    console.log(order);
     sendMail(
        user.email,
        "Your Product Delivery Update Email",
        `
        <div style="font-family: Arial; font-size: 16px;">
          <p>Dear ${user.userName || 'Customer'},</p>
          <p>Your order of <strong>₹${order.amount}</strong> has been processed successfully.</p>
          <p>It will be delivered to the following address:</p>
          <p><strong>${order.address}</strong></p>
          <p>Thank you for shopping with us!</p>
        </div>
        `
      );
}