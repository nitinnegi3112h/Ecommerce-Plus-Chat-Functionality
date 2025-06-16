import Product from "../Models/Product.js"

// Add New Product
export const addNewProduct=async(req,res)=>
{
      try {
        console.log(req.body);
        const newProduct=new Product(req.body);
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
        await Product.findByIdAndDelete(req.params.id);
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
      
       

        res.status(200).json(products);

      } catch (error) {
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