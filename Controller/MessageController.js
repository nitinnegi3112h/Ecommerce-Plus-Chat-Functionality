import mongoose from "mongoose";
import Message from "../Models/MessageSchema.js";

export const getMessage=async (req,res)=>
{
    try {
      
        const user1=req.user.id;
        const user2=req.body.user2;


        if(!user1 || !user2)
        {
            return res.status(401).json({
                message:"Both User Id are required..."
            });
        }

        const messages=await Message.find({
            $or:[{sender:user1,receiver:user2},
                {sender:user2,receiver:user1}]
        }).sort({timestamp:1});

       
        return res.status(201).json({
            messages
        })


    } catch (error) {

        res.status(401).json({
            message:"Error Occur While fetching Messages"
        });
        
    }
}