import express from 'express'
import { verifyToken, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
const router=express.Router();
import {addToCart, deleteCart, getUserCart, updateCartDetails} from "../Controller/CartController.js"

// Add product into Cart
router.post('/addToCart',verifyToken,addToCart);

//Update Product Details
router.put('/:id',verifyTokenAndAuthorization,updateCartDetails);


// Delete Cart
router.delete('/:id',verifyTokenAndAuthorization,deleteCart)


// Get User Cart
router.get('/find/:userId',verifyToken,getUserCart);



export default router;