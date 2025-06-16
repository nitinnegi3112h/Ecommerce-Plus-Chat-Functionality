import User from '../Models/UserSchema.js';
import bcrypt from'bcrypt'
import { rmSync } from 'fs';
import jwt from 'jsonwebtoken'



export const register=async(req,res)=>
{
     try {
         const {email,userName,password,isAdmin}=req.body;
         console.log(req.body);
 
         if(!email || !userName || !password)
         {
             return res.status(401).json('Please Fill all Details First...');
         }
         
         const hashedPassword=await bcrypt.hash(password,10);
 
         const newUser=new User({
             userName:userName,
             email:email,
             password:hashedPassword,
             isAdmin:isAdmin,
         })
 
         const savedUser= await newUser.save();
 
 
          
         return res.status(201).json({
             success:true,
             savedUser
         });
    
 
     } catch (error) {
         console.log(error);
         return res.status(500).json({
             message:"Failed To Register New User",
             error:error,
         })
     }
     
    
}
export const Login=async(req,res)=>
{
     try {
            
            const {userName,password}=req.body;
    
            if(!userName || !password)
            {
                return res.status(500).json({
                    message:"Fill All Details"
                });
            }
    
            const user=await User.findOne({userName});
    
            if(!user)
            {
                 return res.status(500).json({
                    message:"User Not exist In DB...."
                });
            }
    
            const result= await bcrypt.compare(password,user.password);
          
            if(!result)
            {
                return res.status(500).json({
                    message:"Please Enter Right Password...."
                });
            }
            
            user.password=null;
    
            const payload={
                id:user._id,
                isAdmin:user.isAdmin,
            }
    
            const token= jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"3d"});
            const maxAge=2*60*24*24*60;
            
            res.cookie("jwt",token,{
                maxAge,
                secure:true,
                sameSite:"None",
            })
    
            res.status(201).json({
                success:true,
                user,
            })
    
    
          } catch (error) {
    
            console.log(error);
             res.status(501).json({
                success:false
            });
          }
    
}


export const Delete=async(req,res)=>
{
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");

      } catch (error) {
          res.status(200).json("User has been deleted failed...");
      }
}

export const ForgotPassword=async(req,res)=>
{
    try {
        
            const {oldPassword,newPassword}=req.body;
            const userId=req.user.id;


            if(!oldPassword || !newPassword || !userId)
            {
            res.status(401).json({
            message:"Please Enter All required Field..."
            });
            }

            const user=await User.findById(userId);
            console.log(user);

            if(!user)
            {
            return res.status(500).json({
            message:"User Not exist In DB...."
            });
            }


            const result= await bcrypt.compare(oldPassword,user.password);
            console.log(result);
            if(!result)
            {
            return res.status(500).json({
            message:"Please Enter Right Password...."
            });
            }

            const hashedPassword=await bcrypt.hash(newPassword,10);

            const updateUserData=await User.findByIdAndUpdate(userId,
            {$set:{password:hashedPassword}},
            {new:true}
            );


            res.status(201).json({
            message:"User Password Updated Successfully...",
            updateUserData
            });

            } catch (error) {

            console.log(error)
            res.status(401).json({
            message:'User Password Updation Failed Try Again'
            })
            }
}