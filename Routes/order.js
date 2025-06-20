import express from 'express'
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
const router=express.Router();
import { addToOrder, deleteOrder, pendingOrder, previousOrder, updateDeliveryStatus, updateOrderAddress } from '../Controller/OrdreController.js';
// Add product into Order
router.post('/addToOrder',verifyToken,addToOrder);

//Update Order Details
router.put('/updateOrderAddress',verifyToken,updateOrderAddress);

// Delete Order
router.delete('/:id',verifyTokenAndAdmin,deleteOrder);




// Get Previous Order
router.get('/getPreviousOrder',verifyToken,previousOrder);

//Get Pending Order
router.get('/getPendingOrder',verifyToken,pendingOrder);

//Update Delivery Status
router.post('/UpdateDeliveryStatus',verifyTokenAndAdmin,updateDeliveryStatus);

export default router;