import Order from '../Models/OrderSchema.js'
import Product from '../Models/Product.js';
import Sales from '../Models/SalesSchema.js';

// Add product into Order
export const addToOrder=async(req,res)=>
{
    try {         
          const data=req.body;

          const groupSameSellerData={};

          for(const temp of data.products )
          {
          const newData=await Product.findOne({_id:temp.productId});
          const key = newData.sellerId;

          groupSameSellerData[key]= groupSameSellerData[key] || [];

          groupSameSellerData[key].push({ product: newData, quantity: temp.quantity });
          }


          let savedOrder;

          for(const temp in groupSameSellerData)
          {
          const ProductIdAndQuantity=[];
          let totalAmount=0;
          let sellerId;
          const {userId,address} =req.body;

          for(const newData of groupSameSellerData[temp])
          {

          sellerId=newData.product.sellerId;
          ProductIdAndQuantity.push({productId:newData.product._id,quantity:newData.quantity})
          totalAmount+=(newData.product.price * newData.quantity)

          }

          //To update Sales Data to Seller sales
          await Sales.findOneAndUpdate({sellerId:sellerId},
          {$push:{ProductDetails:{$each:ProductIdAndQuantity}}},
          {upsert:true,new:true});

          console.log(ProductIdAndQuantity)
          const newOrder = new Order({
          userId,
          address,
          amount: totalAmount,
          sellerId,
          products: ProductIdAndQuantity // tempData should be an array of product objects
          });

          savedOrder =await newOrder.save();

          }


          res.status(201).json({
          message:"Order has been proceed .....",
          savedOrder
          });

          } catch (error) {

          console.log(error);
          res.status(401).json({
          message:"Order Has been added failed..",
      });
}};

//Update Order Details
export const updateOrderDetails=async(req,res)=>
{
      try {
        
        const updatedOrder=await Order.findByIdAndUpdate(req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );

        res.status(201).json({
            message:"Order Updated Successfully...",
            updatedOrder
        })

      } catch (error) {
        
        res.status(401).json({
            message:"Failed To Updated Order"
        })
      }}


// Delete Order
export const deleteOrder=async(req,res)=>
{
      try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");

      } catch (error) {
          res.status(200).json("Order has been deleted failed...");
      }
}

// Get User Order
export const getUserOrder=async(req,res)=>
{
      try {
       const OrderDetails= await Order.findById(req.params.id);

        res.status(200).json({OrderDetails});

      } catch (error) {
        console.log(error);
          res.status(200).json(
            "Failed To Find Proudcts...."
          );
      }
}





export const pendingOrder=async (req,res)=>
{
  try {
    
    const userId=req.user.id;
    const pendingOrder=await Order.find({$and:[{status:"Pending"},{_id:userId}]});

    res.status(201).json({
      pendingOrder
    });

  } catch (error) {
    
    res.status(401).json({
      message:"Failed To Fetch Pending Order...."
    })
  }
}


export const previousOrder=async (req,res)=>
{
     try {

       const userId=req.user.id;
       console.log(userId);

       const previousOrder=await Order.find({$and:[
        {status:"Delivered"},{userId:userId}
       ]}).populate("products.productId")

       res.status(201).json({
        previousOrder
       });
      
     } catch (error) {
 
      res.status(401).json({
        message:"Failed To fetch Previous Order....."
      })

     }
}


export const updateDeliveryStatus=async (req,res)=>
{
  try {

    const {orderId,newStatus}=req.body;
    const userId=req.user.id;
    const orderData=await Order.findOne({_id:orderId});

    if(userId != orderData.sellerId)
    {
       res.status(401).json({
        message:"You have Not Permission To Update the Status...."
      })
      
    }

    const updatedOrderDetails=await Order.findByIdAndUpdate({_id:orderId},
      {$set:{status:newStatus}},{new:true});
   
      res.status(201).json({
        message:"Order Status Updated Successfully...",
        updatedOrderDetails
      })
      
  } catch (error) {
    
    console.log(error);
    res.status(401).json({
      message:"Failed To Update Delivery Status..."
    })
  }
}