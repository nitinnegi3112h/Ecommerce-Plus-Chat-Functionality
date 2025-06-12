import Sales from "../Models/SalesSchema.js";



export const getSalesData=async(req,res)=>
{
    try {
       const userId=req.user.id; 
       const salesData=await Sales.findOne({sellerId:userId}).populate("ProductDetails.productId")
       let totalEarning=0;

       for(const temp of salesData.ProductDetails)
       {
        totalEarning+=Number(temp.productId.price * temp.quantity)
       }

        res.status(201).json({
          salesData  
        })


    } catch (error) {
        
        console.log(error);
        res.status(401).json({
            Message:"error Occur while getting salesData...."
        })
    }
}