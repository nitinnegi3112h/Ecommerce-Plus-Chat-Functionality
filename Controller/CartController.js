import Cart from "../Models/CartSchema.js";

export const addToCart=async (req,res)=>
{
               try {
              const newCart=new Cart(req.body );
            const savedCart=await newCart.save();
    
            res.status(201).json({
                message:"New Product Add SuccessFully in cart .....",
                savedCart
            });
    
           } catch (error) {
            
             res.status(401).json({
                message:"Failed To Add Product..",
             });
           }
}

export const updateCartDetails=async (req,res)=>
{
        try {
        
        const updatedCart=await Cart.findByIdAndUpdate(req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );

        res.status(201).json({
            message:"Product Updated Successfully...",
            updatedCart
        })

      } catch (error) {
        
        res.status(401).json({
            message:"Failed To Updated Product"
        })
     }
}


export const deleteCart=async (req,res)=>
{
        try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");

      } catch (error) {
          res.status(200).json("Cart has been deleted failed...");
      }
}


export const getUserCart=async (req,res)=>
{
         try {
       const CartDetails= await Cart.findById(req.params.id);

        res.status(200).json({CartDetails});

      } catch (error) {
        console.log(error);
          res.status(200).json(
            "Failed To Find Proudcts...."
          );
      }
}




 