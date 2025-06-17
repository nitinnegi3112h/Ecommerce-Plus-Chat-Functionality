import Product from "../Models/Product.js"
import { renameSync, unlinkSync } from "fs";
import redis from "../Utils/redis.js";
// Add New Product
export const addNewProduct=async(req,res)=>
{
      try {
         
        const {title,
              desc,
              categories,
              size,
              price,
              sellerId
            } =req.body;
        
         

       const date=Date.now();
       let filename="uploads/files/"+date+req.file.originalname;
       renameSync(req.file.path,filename);

        const newProduct=new Product({
             title,
              desc,
              categories,
              size,
              price,
              sellerId,
              img:filename
        });
        const savedProduct=await newProduct.save();

        res.status(201).json({
            message:"New Product Add Successfully.....",
            savedProduct
        });

       } catch (error) {
        
        console.log(error);
         res.status(401).json({
            message:"Failed To Add Product..",
         });
       }
}

//Update Product Details
export const updateProductDetails=async(req,res)=>
{
      try {
        
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );

        res.status(201).json({
            message:"Product Updated Successfully...",
            updatedProduct
        })

      } catch (error) {
        
        res.status(401).json({
            message:"Failed To Updated Product"
        })
      }
}


//Delete Product
export const deleteProduct=async(req,res)=>
{
      try {
        const productId=req.params.id;

        if(!productId)
        {
           return res.status(401).json({
            message:"All field are required compulsory...."
           })
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json("Product has been deleted...");

      } catch (error) {
          res.status(200).json("Product has been deleted failed...");
      }
}


// Get Product
export const getProduct=async(req,res)=>
{
      try {
       const ProductDetails= await Product.findById(req.params.id);

        res.status(200).json({ProductDetails});

      } catch (error) {
        console.log(error);
          res.status(200).json(
            "Failed To Find Proudcts...."
          );
      }
}



// Get All products

export const getAllProduct=async(req,res)=>
{
    const qCategory=req.query.category;
      
    try {
          const userId=req.user.id;
        const cachedData=await redis.get(`allProduct:${userId}`);

        if(cachedData)
        {
          return res.status(200).json(JSON.parse(cachedData));
        }

        
        let products;

        if(qCategory)
        {
           products= await Product.find({
            categories:{
                $in:[qCategory],
            },
        });
        }
        else
        {
            products=await Product.find();
        }

        await redis.set(`allProduct:${userId}`,JSON.stringify(products),'EX',60);


      
        res.status(200).json(products);

      } catch (error) {
        console.log(error);
        res.status(200).json(
            "Failed To Find Products...."
          );
      }
}

export const getCountOfCategory=async (req,res)=>
{
  try {
       
     const result=await Product.aggregate([
      {
        $group:{
          _id:"$categories",
          count:{$sum:1},
        }
      }
     ]);

     res.status(201).json({
      message:'Product Category Count return Successfully..',
      result
     })


  } catch (error) {
    
    res.status(401).json({
      message:"Counting Product Category Count Failed ...."
    })
  }
}


export const FilterProduct=async(req,res)=>
{
  try {
    
    const {search,sortBy,sortOrder}=req.body;

    const filter={};
    const sortOptions={};
    
   if(search)
   {
    filter.title={$regex:search,$options:'i'};
   }
   else if (sortBy)
   {
    sortOptions[sortBy]=sortOrder === 'asc' ? 1 : -1
   }
   else 
   {
      sortOptions.createdAt=-1;
   }


   const product=await Product.find(filter).sort(sortOptions);

   res.status(201).json({
    message: 'Product Filter Successfully...',
    product
   })


  } catch (error) {
    
    res.status(401).json({
      message:"Product Filter Failed ...."
    })

  }
}