import Sales from "../Models/SalesSchema.js";
import redis from "../Utils/redis.js";



export const getSalesData=async(req,res)=>
{
    try {
        
       const userId=req.user.id; 
      
       const cachedSalesData=await redis.get(`salesData:${userId}`);

       if(cachedSalesData)
       {
       return res.status(201).json(JSON.parse(cachedSalesData));
       }

       const salesData=await Sales.findOne({sellerId:userId}).populate("ProductDetails.productId").
        sort({createdAt:-1}); 
        let totalEarning=0;

       for(const temp of salesData.ProductDetails)
       {
        totalEarning+=Number(temp.productId.price * temp.quantity)
       }
       
       await redis.set(`salesData:${userId}`,JSON.stringify(salesData),'EX',60);

      return  res.status(201).json({
          totalEarning,
            salesData  
        })


    } catch (error) {
        
        console.log(error);
      return  res.status(401).json({
            Message:"error Occur while getting salesData...."
        })
    }
}

//APi showing every category detail sales data
export const SellerSalesDataByCategory=async(req,res)=>
{
   try {
       const userId=req.user.id; 
       const cachedSalesData=await redis.get(`salesData:${userId}`);

       if(cachedSalesData)
       {
       return res.status(201).json(JSON.parse(cachedSalesData));
       }
       const salesData=await Sales.findOne({sellerId:userId}).populate("ProductDetails.productId").sort({createdAt:-1}) // let totalEarning=0;

     const sellerProductData={};
     const MoneyData={};
    
        for(const product of salesData.ProductDetails)
        {
          if(!sellerProductData[product.productId.categories])
          {
             sellerProductData[product.productId.categories]=[];
          }

          if(!MoneyData[product.productId.categories])
          {
            MoneyData[product.productId.categories]=0;
          }

          MoneyData[product.productId.categories]+=(product.productId.price * product.quantity) ;
          sellerProductData[product.productId.categories].push(product);
        }
  
      await redis.set(`salesData:${userId}`,JSON.stringify({sellerProductData,MoneyData}),'EX',60);
    
      return  res.status(201).json({
           sellerProductData,
           MoneyData
        })
    } catch (error) {
       return  res.status(401).json({
            Message:"error Occur while getting salesData...."
        })
    }
}

//