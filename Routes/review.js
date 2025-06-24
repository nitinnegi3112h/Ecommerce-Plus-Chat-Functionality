import express from 'express'
import { verifyToken } from '../Middleware/verifyToken.js';
import { AverageProductRating, createNewReview, deleteProductReview, getProductReview, updateProductReview } from '../Controller/ReviewController.js';
const router=express.Router();

router.post('/createNewReview',verifyToken,createNewReview);
router.post('/findProductReview',verifyToken,getProductReview);
router.put('/updateProductReview',verifyToken,updateProductReview);
router.delete('/deleteProductReview',verifyToken,deleteProductReview);
router.get('/getProductRating',verifyToken,AverageProductRating);

export default router;