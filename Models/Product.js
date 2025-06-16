import mongoose, { mongo } from 'mongoose'

const ProductSchema=new mongoose.Schema({

     title:{type:String,required:true},
     desc:{type:String,required:true},
     img:{type:String,required:true,default:null},
     categories:{type:String,
          enum:['Device','Clothes','Grocery','HealthCare'],
          required:true,
     },
     size:{type:String},
     color:{type:String},
     price:{type:Number,required:true},
     sellerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
    
  
},{timestamps:true});


const Product=mongoose.model("Product",ProductSchema);


export default Product;