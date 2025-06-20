import Joi from "joi";
import Coupon from "../Models/CouponSchema.js"
import redis from "../Utils/redis.js";


const createCouponSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  discount: Joi.number().min(10).max(10000).required(),
  expiry: Joi.date().required(),
});

export const CreateCoupon=async(req,res)=>
{
    try {
        
          const { error, value } = createCouponSchema.validate(req.body);
         
          if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

          const creator=req.user.id;

           const { name,discount,expiry} = value;

        const newCoupon=await Coupon.create({
            name,
            discount,
            expiry,
            creator
        });

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
            isClaimed:false,
            creator:userId
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

const updateCouponSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  discount: Joi.number().min(10).max(10000).required(),
  expiry: Joi.date().required(),
  couponId:Joi.string().required()
});


export const updateCoupon=async(req,res)=>
{
     try {

        const { error, value } = updateCouponSchema.validate(req.body);
         
          if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

        const { name,discount,expiry,couponId} = value;

        const updatedCoupon=await Coupon.findOneAndUpdate({_id:couponId},
            {$set: {name,discount,expiry}},
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