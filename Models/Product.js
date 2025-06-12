import mongoose from 'mongoose'

const ProductSchema=new mongoose.Schema({

     title:{type:String,required:true},
     desc:{type:String,required:true},
     img:{type:String,required:false,default:null},
     categories:{type:Array},
     size:{type:String},
     color:{type:String},
     price:{type:String,required:true},
    
  
},{timestamps:true});


const Product=mongoose.model("Product",ProductSchema);


export default Product;