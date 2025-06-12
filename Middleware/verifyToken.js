import jwt from 'jsonwebtoken'

const verifyToken=(req,res,next)=>
{
    try {
     
    const token=req.cookies.jwt;
  
    if(!token)
    {
       return res.status(401).json({
        message:"Failed To Fetch Token....."
       });
    }
      
    const user=jwt.verify(token,process.env.JWT_SECRET);
    
    if(!user){
       return res.status(401).json({
        message:"Failed To Give access Please Login again....."
       });
    }
    else
    {     req.user=user;
          next();
    }
 

    } catch (error) {
        console.log(error);
        return res.status(401).json({
        message:"Token Verification failed...",
        error
       });
    }
}


const verifyTokenAndAuthorization=(req,res,next)=>
{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin)
        {
          next();
        }
        else
        {
            return res.status(401).json({
                message:"You are not allowed to do modifications."
            });
        }
    });
}


const verifyTokenAndAdmin=(req,res,next)=>
{
    verifyToken(req,res,()=>{
        console.log(req.user);
        if( req.user.isAdmin)
        {
          next();
        }
        else
        {
            return res.status(401).json({
                message:"You are not allowed to do modifications."
            });
        }
    });
}


export {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};