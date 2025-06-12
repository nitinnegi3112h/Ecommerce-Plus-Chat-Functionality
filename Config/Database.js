import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

export const connect=()=>
{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log("Database Connected Successfully")})
    .catch((error)=>{
        console.log("Database Connection Failed.....");
        console.log(error);
        process.exit(1);
    })
}