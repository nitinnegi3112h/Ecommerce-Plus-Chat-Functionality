import express from 'express'
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
const router=express.Router();
import { addToOrder, deleteOrder, getUserOrder, updateOrderDetails, } from '../Controller/OrdreController.js';
// Add product into Order
router.post('/addToOrder',verifyToken,addToOrder);

//Update Order Details
router.put('/:id',verifyTokenAndAdmin,updateOrderDetails);

// Delete Order
router.delete('/:id',verifyTokenAndAdmin,deleteOrder);


// Get User Order
router.get('/find/:userId',verifyTokenAndAuthorization,getUserOrder);




export default router;