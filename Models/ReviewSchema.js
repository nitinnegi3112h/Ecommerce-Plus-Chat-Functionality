import mongoose, { mongo } from 'mongoose'

const ReviewSchema=new mongoose.Schema({

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
  message:{
    type:String,
  },
  rating:{
    type:Number,
    required:true,
    min:1,
    max:5
  }
  
},{timestamps:true});


const Review=mongoose.model("Review",ReviewSchema);


export default Review;