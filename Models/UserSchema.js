import  mongoose from 'mongoose'


const UserSchema=new mongoose.Schema({

     userName:{type:String,required:true,unique:true},
     email:{type:String,required:true,unique:true},
     password:{type:String,required:true},
     isAdmin:{type:Boolean,default:false},
     isOwner:{type:Boolean,default:false},
  
},{timestamps:true});

const User=mongoose.model("User",UserSchema);

export default User;