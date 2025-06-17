import Sales from "../Models/SalesSchema.js";
import redis from "../Utils/redis.js";



export const getSalesData=async(req,res)=>
{
    try {
        
       const userId=req.user.id; 
      
       const cachedSalesData=await redis.get(`salesData:${userId}`);

       if(cachedSalesData)
       {
        res.status(201).json(JSON.parse(cachedSalesData));
       }

       const salesData=await Sales.findOne({sellerId:userId}).populate("ProductDetails.productId")
       let totalEarning=0;

       for(const temp of salesData.ProductDetails)
       {
        totalEarning+=Number(temp.productId.price * temp.quantity)
       }
       
       await redis.set(`salesData:${userId}`,JSON.stringify(salesData),'EX',60);

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