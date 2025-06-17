import User from "../Models/UserSchema.js";
//Update User
const updateUser=async(req,res)=>{

    try {
        
        const updatedUser=await User.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true}
        );
     
        res.status(201).json({message:"User Profile Updated Successfully",updatedUser});

    } catch (error) {

        res.status(401).json({error});
    }
}

// Get User
 const getUser=async(req,res)=>
{
      try {
       const user= await User.findById(req.params.id);

        res.status(200).json({user});

      } catch (error) {
          res.status(200).json(
            "Failed To Find Users...."
          );
      }
}

//Get all Useers
 const getAllUsers=async(req,res)=>
{
      try {
       const users= await User.find();

        res.status(200).json(users);

      } catch (error) {
          res.status(200).json(
            "Failed To Find Users...."
          );
      }
}


 const userStats=async (req,res)=>{

  const date=new Date();
  const lastYear=new Date(date.setFullYear(date.getFullYear-1));

    try {
       
        const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
        $project: {
        month: { $month: "$createdAt" },  // Correct field reference
        },
        },
        {
        $group: {
        _id: "$month",
        total: { $sum: 1 },
        },
        },
        ]);

         
      return res.status(201).json(data);

    } catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
}



export{updateUser,getUser,getAllUsers,userStats}