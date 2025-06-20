import { createRazorpayInstance } from "../Utils/razorpayConfig.js";
import dotenv  from "dotenv";
dotenv.config();
import crypto from 'crypto'


const razorpayInstance=createRazorpayInstance();

export const createOrder=async (req,res)=>
{
    const {courseId,amount}=req.body;

    const options={
        amount:amount*100,
        currency:"INR",
        receipt: 'receipt_order1'
    }

    try {
        
        razorpayInstance.orders.create(options,(err,order)=>
        {
        if(err)
        {
        return res.status(401).json({
        success:false,
        message:"Something went wrong..."
        });
        }else 
        {
            console.log(order);
        return res.status(201).json({
        success:true,
        order:order
        })
        }
        })

        } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Something went wrong.."
        })
        }


}

export const verifyPayment=async(req,res)=>
{
    const {order_id,payment_id,signature}=req.body;

    console.log(order_id,payment_id,signature);
    const secret=process.env.RAZORPAY_KEY_SECRET;

    const hmac=crypto.createHmac('sha256',secret);

    hmac.update(order_id+"|"+ payment_id);

    const generatedSignature=hmac.digest("hex");

    if(generatedSignature === signature)
    {
        return res.status(200).json({
            success:true,
            message:"Payment Verified..."
        });
    }else
    {
        return res.status(400).json({
            success:false,
            message:"Failed To Verify Payment..."
        })
    }

}