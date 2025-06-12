import Order from '../Models/OrderSchema.js'
import Sales from '../Models/SalesSchema.js';

// Add product into Order
export const addToOrder=async(req,res)=>
{
       try {   

        

        const newOrder=new Order(req.body );
        const savedOrder=await newOrder.save();
        const ProductSales=await Order.findById(savedOrder._id).populate('products.productId');

        for(const p of ProductSales.products)
        {
           const sellerId=p.productId.sellerId;
           const quantity=p.quantity;
           const productId=p.productId._id;
         
            await Sales.findOneAndUpdate({sellerId:sellerId},
            {$push:{ProductDetails:{productId,quantity:quantity}}},
            {upsert:true,new:true});

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
       }
};

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

    const updatedOrderDetails=await Order.findByIdAndUpdate({orderId},
      {$set:{status:newStatus}},{new:true});
   
      res.status(201).json({
        message:"Order Status Updated Successfully...",
        updateOrderDetails,
      })
      
  } catch (error) {
    
    res.status(401).json({
      message:"Failed To Update Delivery Status..."
    })
  }
}