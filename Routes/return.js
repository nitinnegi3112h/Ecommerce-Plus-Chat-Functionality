
import express from 'express';
import { verifyToken, verifyTokenAndAdmin } from '../Middleware/verifyToken.js';
import { createReturnRequest, ProductReturnRequestForSeller, returnRequestStatus, updateReturnStatus } from '../Controller/ReturnRefundController.js';
const router=express.Router();


router.post('/createReturnRequest',verifyToken,createReturnRequest);
router.get('/returnStatus',verifyToken,returnRequestStatus);
router.get('/productReturnRequest',verifyTokenAndAdmin,ProductReturnRequestForSeller);
router.put('/updateReturnStatus',verifyTokenAndAdmin,updateReturnStatus);


export default router;