import Coupon from "../Models/CouponSchema.js"
import redis from "../Utils/redis.js";



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
        const userId=req.user.id;

        const cachedCoupon=await redis.get(`${userId}:userCoupon`);

        if(cachedCoupon)
        {
            return  res.status(201).json({
            message:"These are all valid coupons",
            Coupon: JSON.parse(cachedCoupon)
        })
        }

        const allCoupon=await Coupon.find({
            expiry:{$gte:new Date()},
            isClaimed:false
        });

        await redis.set(`${userId}:userCoupon`,JSON.stringify(allCoupon),'EX',60);

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