import express from 'express'
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
const router=express.Router();
import { addToOrder, deleteOrder, getUserOrder, previousOrder, updateOrderDetails, } from '../Controller/OrdreController.js';
// Add product into Order
router.post('/addToOrder',verifyToken,addToOrder);

//Update Order Details
router.put('/:id',verifyTokenAndAdmin,updateOrderDetails);

// Delete Order
router.delete('/:id',verifyTokenAndAdmin,deleteOrder);


// Get User Order
router.get('/find/:userId',verifyTokenAndAuthorization,getUserOrder);


// Get Previous Order
router.get('/getPreviousOrder',verifyToken,previousOrder);

//Update Delivery Status
router.get('/UpdateDeliveryStatus',verifyToken,previousOrder);

export default router;