import mongoose from "mongoose";

const ReturnRefundSchema=new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  productId:{
     type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true,
  },
  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  reason:{
    type:String,
    required:true,
  },
    status:{
      type:String,
      enum:["Requested","Rejected","Refunded","Approved"],
      default:"Requested"
    }
  
},{timestamps:true});


const ReturnRefund=mongoose.model("ReturnRefund",ReturnRefundSchema);


export default ReturnRefund;