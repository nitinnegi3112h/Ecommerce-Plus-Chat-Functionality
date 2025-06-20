import User from '../Models/UserSchema.js';
import bcrypt from'bcrypt'
import { rmSync } from 'fs';
import Joi from 'joi';
import jwt from 'jsonwebtoken'


const registerSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  isAdmin: Joi.boolean().optional(),
});

export const register=async(req,res)=>
{
     try {
         const { error, value } = registerSchema.validate(req.body);
         
          if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

           const { userName, email, password,isAdmin } = value;
         
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

const loginSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(5).required(),
});

export const Login=async(req,res)=>
{
     try {
        
         const { error, value } = loginSchema.validate(req.body);
         
          if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

           const { userName, password } = value;
          
    
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
         const userId=req.params.id;

         if(userId)
         {
            return res.status(401).json({
                message:"All field Are required...."
            })
         }

        await User.findByIdAndDelete(userId);
        res.status(200).json("User has been deleted...");

      } catch (error) {
          res.status(200).json("User has been deleted failed...");
      }
}

const forgotPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(5).required(),
  newPassword: Joi.string().min(5).required(),
});

export const ForgotPassword=async(req,res)=>
{
    try {
        
        const { error, value } = forgotPasswordSchema.validate(req.body);
         
          if (error) {
           return res.status(400).json({ message: error.details[0].message });
          }

         const { oldPassword, newPassword } = value;
          
         const userId=req.user.id;

         const user=await User.findById(userId);
       

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