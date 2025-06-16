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

