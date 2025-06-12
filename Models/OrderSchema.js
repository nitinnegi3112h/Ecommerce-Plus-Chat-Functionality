import mongoose, { mongo } from 'mongoose'

const OrderSchema=new mongoose.Schema({

     userId:{type:String,required:true},
     products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                default:1,
            }
        }
     ],
     amount:{type:Number,required:true},
     address:{type:Object,required:true},
     status:{type:String,default:"Processing",enum:['Processing','Shipped','Delivered']}
  
},{timestamps:true});


const Order=mongoose.model("Order",OrderSchema);


export default Order;