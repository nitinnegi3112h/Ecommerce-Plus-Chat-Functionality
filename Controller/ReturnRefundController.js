import Joi from "joi";
import ReturnRefund from "../Models/RefundReturnSchema.js";


const returnRefundSchema = Joi.object({
  productId: Joi.string().required(),
  sellerId: Joi.string().required(),
  reason: Joi.string().required(),
});

//Create new return refund request ....
export const createReturnRequest=async(req,res)=>
{
    try {
 
        const userId=req.user.id;
        const { error, value } = returnRefundSchema.validate(req.body);

        if (error) {
        return res.status(400).json({ message: error.details[0].message });
        }

        const { productId,sellerId,reason}=value;

        const newReturn=await ReturnRefund.create({
            productId,
            sellerId,
            userId,
            reason,
        });

        return res.status(201).json({
            success:true,
            message:"Return Request process Successfully....."
        })

    } catch (error) {
       
        return res.status(201).json({
        success:false,
        message:"Return Request process failed..."
        })

    }
}

//Status of return refund request 
export const returnRequestStatus=async(req,res)=>
{
    try {
        
        const userId=req.user.id;
        const pendingRequest=await ReturnRefund.find({userId:userId}).sort({createdAt:-1});

        return res.status(201).json({
            success:true,
            pendingRequest,
        })

    } catch (error) {

        console.log(error);
          return res.status(401).json({
            success:false,
            message:"Failed To fetch return request Data....",
        })
    }
}


//Seller Product return refund request 
export const ProductReturnRequestForSeller=async(req,res)=>
{
    try {
        
        const userId=req.user.id;
        const pendingRequest=await ReturnRefund.find({sellerId:userId}).sort({createdAt:-1});

        return res.status(201).json({
            success:true,
            pendingRequest,
        })

    } catch (error) {

        console.log(error);
          return res.status(401).json({
            success:false,
            message:"Failed To fetch return request Data....",
        })
    }
}


const updateReturnSchema = Joi.object({
  returnId: Joi.string().required(),
  status: Joi.string().required(),
});

//Change Status Of return Request
export const updateReturnStatus=async(req,res)=>
{
    try {
     
        const { error, value } = updateReturnSchema.validate(req.body);

        if (error) {
        return res.status(400).json({ message: error.details[0].message });
        }

        const { returnId,status}=value;

        const updatedValue=await ReturnRefund.findByIdAndUpdate({_id:returnId},
            {$set:{status}},
            {new:true}
        )

        return res.status(201).json({
            success:true,
            updatedValue
        });
       

    } catch (error) {

         console.log(error)
          return res.status(401).json({
            success:false,
            message:"Failed To Update Return Status...",
        })
    }
}
