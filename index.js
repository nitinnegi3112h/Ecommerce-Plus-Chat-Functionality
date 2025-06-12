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
const app=express();
import setupSocket from "./Socket.js"

app.use(cookieParser());
app.use(express.json());
const PORT=process.env.PORT || 4000;


app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/message',messageRoutes);

const server=app.listen(PORT,()=>{
    connect()
    console.log('Server is running on Port No ',PORT);
})

setupSocket(server);
