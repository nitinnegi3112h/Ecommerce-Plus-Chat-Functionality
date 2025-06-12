import express from "express"
import { verifyTokenAndAdmin } from "../Middleware/verifyToken.js";
import { getSalesData } from "../Controller/SellerController.js";
const router=express.Router();


router.get('/getSalesData',verifyTokenAndAdmin,getSalesData);

export default router;