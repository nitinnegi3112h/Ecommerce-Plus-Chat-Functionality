import express from 'express';
import { verifyTokenAndAdmin } from '../Middleware/verifyToken.js';
import { CreateCoupon, getAllCoupon, updateCoupon } from '../Controller/CouponController.js';
const router=express.Router();


router.post('/createNewCoupon',verifyTokenAndAdmin,CreateCoupon);
router.get('/getAllCoupon',verifyTokenAndAdmin,getAllCoupon);
router.post('/updateCoupon',verifyTokenAndAdmin,updateCoupon);

export default router;