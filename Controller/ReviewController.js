import Joi from "joi";
import Review from "../Models/ReviewSchema.js";
import mongoose from "mongoose";
import redis from "../Utils/redis.js";



const reviewSchema = Joi.object({
  productId: Joi.string().required(),
  message: Joi.string().min(1).max(100).required(),
  rating: Joi.number().min(1).max(5).required(),
});

//Create New Review
export const createNewReview=async(req,res)=>
{
    try {
        const userId=req.user.id;

        const { error, value } = reviewSchema.validate(req.body);
         
         if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

        const {productId,message,rating } = value;

        const newReview=await Review.create({
            userId,
            productId,
            message,
            rating
        });


        return res.status(201).json({
           message:"Review And Rating Given Successfully....",
           newReview
        });

    } catch (error) {
        
        console.log(error)
        return res.status(401).json({
           message:"Adding New rating and Review Failed.."
        });
    }
}


//Get Product Review
export const getProductReview=async(req,res)=>
{
    try {
        const userId=req.user.id;
         const cachedProductReviw=await redis.get(`${userId}:productReview`);
        
        if(cachedProductReviw)
        {
            return  res.status(201).json({
             success:true,
            productReview: JSON.parse(cachedProductReviw)
        })
        }

        const {productId}=req.body;

        if(!productId)
        {
            return res.status(401).json({
                message:"Product Id is Required for review",
            });
        }

        const productReview=await Review.find({productId:productId}).populate('userId');

        await redis.set(`${userId}:productReview`,JSON.stringify(productReview),'EX',60);

       return res.status(201).json({
        success:true,
        productReview,
       }) ;

    } catch (error) {
    
         return res.status(401).json({
                message:"Failed to fetch product review"
       }) ;

    }
}

//Update Review 
export const updateProductReview=async(req,res)=>
{
    try {
        
        const {reviewId}=req.body;

        if(!reviewId)
        {
            return res.status(401).json({
                message:"Review Id is Required for update review",
            });
        }

        const updatedProductReview = await Review.findByIdAndUpdate(
            reviewId,
            { $set: req.body },
            {new:true}
        );


       return res.status(201).json({
        success:true,
        updatedProductReview,
       }) ;

    } catch (error) {
    
         return res.status(401).json({
                message:"Failed to update Product Review.."
       }) ;

    }
}


//Delete Review
export const deleteProductReview=async(req,res)=>
{
    try {
        
        const {productId}=req.body;

        if(!productId)
        {
            return res.status(401).json({
                message:"Review Id is Required for update review",
            });
        }

       await Review.findByIdAndDelete(reviewId);

       return res.status(201).json({
        success:true,
        message:"Product Review Deleted Successfully..."
       });

    } catch (error) {
    
         return res.status(401).json({
        message:"Failed to Delete Product Review.."
       });

    }
}


//Get Average Rating of Product
export const AverageProductRating=async(req,res)=>
{
    try {

        const userId=req.user.id;
         const cachedAverageProductRating=await redis.get(`${userId}:AverageProductRating`);
        
        if(cachedAverageProductRating)
        {
            return  res.status(201).json({
             success:true,
            productRating: JSON.parse(cachedAverageProductRating)
        })
        }
        
        const {productId}=req.body;

        if(!productId)
        {
            return res.status(401).json({
                message:"Product Id is Required for rating ",
            });
        }

       const productRating=await Review.aggregate([
        {$match:{productId:new mongoose.Types.ObjectId(productId)}},
          {
            $group:{
                _id:'$productId',
                averageRating:{$avg:'$rating'},
                totalReview:{$sum:1}
            }
          }
       ]);

        await redis.set(`${userId}:AverageProductRating`,JSON.stringify(productRating),'EX',60);

       return res.status(201).json({
        success:true,
        productRating
       });

    } catch (error) {
         console.log(error);
         return res.status(401).json({
        message:"Failed to Detect Product Rating.."
       });

    }
}