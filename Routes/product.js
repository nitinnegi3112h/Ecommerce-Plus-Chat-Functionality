import express from 'express'
import { verifyToken, verifyTokenAndAdmin } from '../Middleware/verifyToken.js';
import {addNewProduct, deleteProduct, FilterProduct, getAllProduct, getCountOfCategory, getProduct, updateProductDetails} from "../Controller/ProductController.js"
import multer from 'multer';
const router=express.Router();


const upload=multer({dest:"uploads/files/"})

// Add New Product
router.post('/addProduct',verifyTokenAndAdmin,upload.single("product_image") ,addNewProduct)

//Update Product Details
router.put('/:id',verifyTokenAndAdmin,updateProductDetails);


//Delete Product
router.delete('/deleteProduct/:id',verifyTokenAndAdmin,deleteProduct)

// Get Product
router.get('/find/:id',verifyTokenAndAdmin,getProduct);



// Get All products

router.get('/',verifyToken,getAllProduct);
router.get('/getCountOfCategory',verifyTokenAndAdmin,getCountOfCategory);
router.post('/filterProduct',verifyToken,FilterProduct);

export default router;