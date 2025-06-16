import Coupon from "../Models/CouponSchema.js"



export const CreateCoupon=async(req,res)=>
{
    try {
        
        const newCoupon=await Coupon.create(req.body);

        res.status(201).json({
            message:"New Coupon Created Successfully...",
            newCoupon
        });

    } catch (error) {
        
        res.status(401).json({
            message:"Failed To Create New Coupon Code"
        })
    }
}

export const getAllCoupon=async(req,res)=>
{
    try {
        
        const allCoupon=await Coupon.find({
            expiry:{$gte:new Date()},
            isClaimed:false
        });

        res.status(201).json({
            message:"These are all valid coupons",
            allCoupon
        })

    } catch (error) {
        
        res.status(401).json({
            message:"failed to get all coupons...."
        })
    }
}

export const updateCoupon=async(req,res)=>
{
     try {
        
        const {couponName}=req.body;

        if(!couponName)
        {
          return res.status(401).json({
            message:"All Field are Required"
          })
        }

        const updatedCoupon=await Coupon.findOneAndUpdate({name:couponName},
            {$set: req.body},
            {new:true}
        );

        return res.status(201).json({
            message:"Coupon Updated Successfully...",
            updatedCoupon
        })


     } catch (error) {
         return res.status(201).json({
            message:"Coupon Updation Failed..."
        })
     }

}