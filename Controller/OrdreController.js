import Coupon from '../Models/CouponSchema.js';
import Order from '../Models/OrderSchema.js'
import Product from '../Models/Product.js';
import Sales from '../Models/SalesSchema.js';
import User from '../Models/UserSchema.js';
import { sendMail } from '../Utils/MailerSender.js';

// Add product into Order
export const addToOrder = async (req, res) => {
  try {
    const { userId, address, products,coupon } = req.body;

    const groupedBySeller = {};
    let user = await User.findById(userId);
    let savedOrders = [];

    
    const CouponData=await Coupon.findOne({name:coupon});

    if(coupon && ( !CouponData || CouponData.expiry < new Date() || CouponData.isClaimed === true))
    {  
     
       return  res.status(401).json({
        message:"Coupon Data is Invalid....."
      });
    }

    // Group products by seller
    for (const item of products) {
      const product = await Product.findById(item.productId);
      const sellerId = product.sellerId;

      if (!groupedBySeller[sellerId]) {
        groupedBySeller[sellerId] = [];
      }

      groupedBySeller[sellerId].push({
        product,
        quantity: item.quantity,
      });
    }

    // Create separate orders for each seller
    for (const sellerId in groupedBySeller) {
      const items = groupedBySeller[sellerId];

      const productList = [];
      let totalAmount = 0;

      for (const { product, quantity } of items) {
        productList.push({ productId: product._id, quantity });
        totalAmount += product.price * quantity;
      }

      // Update seller's sales record
      await Sales.findOneAndUpdate(
        { sellerId },
        { $push: { ProductDetails: { $each: productList } } },
        { upsert: true, new: true }
      );
       
      let discount=0;
      if(CouponData && CouponData.isClaimed == false)
      {
        totalAmount=totalAmount-CouponData.discount;
        totalAmount = totalAmount < 0 ? 0 : totalAmount;
        CouponData.isClaimed=true;
        await Coupon.findByIdAndUpdate(CouponData._id,{$set:{isClaimed:true}});
        discount=CouponData.discount; 
      }
       
      // Create and save the order
      const newOrder = new Order({
        userId,
        address,
        amount: totalAmount,
        sellerId,
        products: productList,
        discount,
      });

      const saved = await newOrder.save();
      savedOrders.push(saved);
    }

    // Send email to user for each order
    for (const order of savedOrders) {
      sendMail(
        user.email,
        "Your Product Delivery Update Email",
        `
        <div style="font-family: Arial; font-size: 16px;">
          <p>Dear ${user.userName || 'Customer'},</p>
          <p>Your order of <strong>₹${order.amount}</strong> has been processed successfully.</p>
          <p>It will be delivered to the following address:</p>
          <p><strong>${order.address}</strong></p>
          <p>Thank you for shopping with us!</p>
        </div>
        `
      );
    }

    res.status(201).json({
      message: "Order has been processed successfully.",
      savedOrders,
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Order processing failed.",
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