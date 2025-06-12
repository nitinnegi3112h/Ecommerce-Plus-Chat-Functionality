import Order from '../Models/OrderSchema.js'

// Add product into Order
export const addToOrder=async(req,res)=>
{
       const newOrder=new Order(req.body );

       try {
        const savedOrder=await newOrder.save();

        res.status(201).json({
            message:"Order has been proceed .....",
            savedOrder
        });

       } catch (error) {
        
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





