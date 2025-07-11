import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connect } from './config/database.js';
import userRoutes from './Routes/user.js';
import authRoutes from './Routes/auth.js';
import productRoutes from './Routes/product.js';
import cartRoutes from './Routes/cart.js';
import orderRoutes from './Routes/order.js';
import messageRoutes from "./Routes/message.js"
import salesRoutes from "./Routes/sales.js"
import paymentRoutes from "./Routes/payment.js" 
import couponRoutes from "./Routes/coupon.js" 
import reviewRoutes from "./Routes/review.js" 
import returnRoutes from "./Routes/return.js" 
const app=express();
import setupSocket from "./Utils/Socket.js" 
import cors from 'cors';
import rateLimit from 'express-rate-limit'

app.use(cors());

app.use(cookieParser());
app.use(express.json());
const PORT=process.env.PORT || 4000;

//Only 1000 request can accept in 10 min tenure
const limiter=rateLimit({
    windowMs:10*60*1000,
    max:1000,
    message:"Too many Request at a time, please try again later..."
});

app.use(limiter);


app.use('/uploads/files',express.static('/uploads/files'));
app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/message',messageRoutes);
app.use('/api/sale',salesRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/coupon',couponRoutes);
app.use('/api/review',reviewRoutes);
app.use('/api/return',returnRoutes);




const server=app.listen(PORT,()=>{
    connect()
    console.log('Server is running on Port No ',PORT);
})

setupSocket(server);
