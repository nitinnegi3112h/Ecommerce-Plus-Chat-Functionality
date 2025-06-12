import express from 'express'
import { verifyToken, verifyTokenAndAdmin } from '../Middleware/verifyToken.js';
import {addNewProduct, deleteProduct, getAllProduct, getProduct, updateProductDetails} from "../Controller/ProductController.js"

const router=express.Router();

// Add New Product
router.post('/addProduct',verifyTokenAndAdmin,addNewProduct)

//Update Product Details
router.put('/:id',verifyTokenAndAdmin,updateProductDetails);


//Delete Product
router.delete('/:id',verifyTokenAndAdmin,deleteProduct)

// Get Product
router.get('/find/:id',verifyTokenAndAdmin,getProduct);



// Get All products

router.get('/',verifyToken,getAllProduct);

export default router;