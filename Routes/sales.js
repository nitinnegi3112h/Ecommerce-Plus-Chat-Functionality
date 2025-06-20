import express from "express"
import { verifyTokenAndAdmin } from "../Middleware/verifyToken.js";
import { getSalesData, SellerSalesDataByCategory } from "../Controller/SellerController.js";
const router=express.Router();


router.get('/getSalesData',verifyTokenAndAdmin,getSalesData);
router.get('/getSellerSalesDataByCategory',verifyTokenAndAdmin,SellerSalesDataByCategory);

export default router;