import mongoose  from "mongoose";

const SalesSchema=new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ProductDetails:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            quantity:
            {
                type:Number,
                required:true
            }

        }
    ]
})

const Sales= mongoose.model("Sales",SalesSchema);

export default Sales;