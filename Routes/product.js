import express from 'express'
import { verifyToken, verifyTokenAndAdmin } from '../Middleware/verifyToken.js';
import {addNewProduct, deleteProduct, FilterProduct, getAllProduct, getCountOfCategory, getProduct, getSellerProductData, updateProductDetails, trendingProduct, trendingSellingProductOfSeller} from "../Controller/ProductController.js"
import multer from 'multer';
const router=express.Router();


const upload=multer({dest:"uploads/files/"})

// Add New Product
router.post('/addProduct',verifyTokenAndAdmin,upload.single("product_image") ,addNewProduct)

//Update Product Details
router.put('/updateProductDetails',verifyTokenAndAdmin,updateProductDetails);

//Delete Product
router.delete('/deleteProduct/:id',verifyTokenAndAdmin,deleteProduct)

// Get Product
router.get('/find/:id',verifyTokenAndAdmin,getProduct);

// Get All products
router.get('/',verifyToken,getAllProduct);

// Get ALl week trending products
router.get('/getTrendingProducts',verifyToken,trendingProduct);

// Get Seller weekly high selling product 
router.get('/getSellerTrendingProduct',verifyTokenAndAdmin,trendingSellingProductOfSeller);

router.get('/getCountOfCategory',verifyTokenAndAdmin,getCountOfCategory);
router.post('/filterProduct',verifyToken,FilterProduct);
router.get('/getSellerProductData',verifyTokenAndAdmin,getSellerProductData);

export default router;