
import mongoose, { mongo } from "mongoose";

const CouponSchema=new mongoose.Schema({
  
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    discount:{
        type:Number,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    isClaimed:{
        type:Boolean,
        required:true,
        default:false
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
    
})

const Coupon=mongoose.model("Coupon",CouponSchema);

export default Coupon;