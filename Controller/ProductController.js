import Product from "../Models/Product.js"
import { renameSync, unlinkSync } from "fs";
import redis from "../Utils/redis.js";
import Joi from "joi";
import Order from "../Models/OrderSchema.js";
import mongoose from "mongoose";

const registerSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  desc: Joi.string().min(3).max(100).required(),
  categories: Joi.string().valid('Device','Clothes','Grocery','HealthCare').required(),
  size: Joi.string().required(),
  price: Joi.number().required(),
  sellerId: Joi.string().required(),
  });

// Add New Product
export const addNewProduct=async(req,res)=>
{
      try {

          const { error, value } = registerSchema.validate(req.body);

          if (error) {
          return res.status(400).json({ message: error.details[0].message });
          }

          const { title, desc,categories,size,price,sellerId } = value;
         
      
        if(!req.file)
        {
          return res.status(401).json({
            message:"Image of Product is also required To create New Product..."
          })
        }

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
        
        const {productId}=req.body;

        const updatedProduct=await Product.findByIdAndUpdate(productId,
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
        
        const ProductId=req.params.id;

       const ProductDetails= await Product.findById(ProductId);

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


export const getSellerProductData=async (req,res)=>
{
  try {
          
    const userId=req.user.id;

    const cachedSellerProductData=await redis.get(`getSellerProductData:${userId}`);

    if(cachedSellerProductData)
    {
    res.status(201).json(JSON.parse(cachedSellerProductData));
    }

    const ProductData=await Product.find({sellerId:userId});

   
     await redis.set(`getSellerProductData:${userId}`,JSON.stringify(ProductData),'EX',60);

    return res.status(201).json({
      ProductData
    })


  } catch (error) {
     console.log(error);
    return res.status(401).json({
      message:"Failed To Fetch Product Data...."
    })
  }
}


//used To get trending Product....
export const trendingProduct=async(req,res)=>
{
  try {
    
     const trendingProduct=await Order.aggregate([
      {
        $match:{
          createdAt:{
            $gte:new Date(Date.now()-30*24*60*60*1000)
          }
        }
      },
      {
        $unwind:"$products"
      },
      {
        $group:{
          _id:"$products.productId",
          totalSold:{$sum: "$products.quantity"},
        }
      },
      {
        $match:{
          totalSold:{$gt:10}
        }
      },
      {$lookup:{
        from:"products",
        localField:"_id",
        foreignField:"_id",
        as:"product"
      }},
      {
        $unwind:"$product"
      },
      {
        $project:{

          _id:0,
          productId:"$product._id",
          totalSold:1,
          price:"$product.price",
          name:"$product.title",
          image:"$product.img",
          categories:"$product.categories",
        },

      },
      {
      $sort: { totalSold: -1 }  
      },
    
     ])


     return res.status(201).json({
      success:true,
      trendingProduct
     })

  } catch (error) {
    
    console.log(error)
     return res.status(201).json({
      success:false,
      message:"failed to fetch trending Product....."
     })
  }
}


//used To get trendingSellingProductOfSeller ....
export const trendingSellingProductOfSeller=async(req,res)=>
{
  try {
    const userId=new mongoose.Types.ObjectId(req.user.id);
     const trendingProduct=await Order.aggregate([
      {
        $match:{
          createdAt:{
            $gte:new Date(Date.now()-30*24*60*60*1000)
          },
          sellerId:userId,
        }
      },
      {
        $unwind:"$products"
      },
      {
        $group:{
          _id:"$products.productId",
          totalSold:{$sum: "$products.quantity"},
        }
      },
      {
        $match:{
          totalSold:{$gt:5}
        }
      },
      {$lookup:{
        from:"products",
        localField:"_id",
        foreignField:"_id",
        as:"product"
      }},
      {
        $unwind:"$product"
      },
      {
        $project:{

          _id:0,
          productId:"$product._id",
          totalSold:1,
          price:"$product.price",
          name:"$product.title",
          image:"$product.img",
          categories:"$product.categories",
        },

      },
      {
      $sort: { totalSold: -1 }  
      },
    
     ])


     return res.status(201).json({
      success:true,
      trendingProduct
     })

  } catch (error) {
    
    console.log(error)
     return res.status(201).json({
      success:false,
      message:"failed to fetch trending Product....."
     })
  }
}