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

