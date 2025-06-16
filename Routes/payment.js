import express from 'express'
import { addCard, createCustomer } from '../Controller/PaymentController.js';
const router=express.Router();


router.post('/createCustomer',createCustomer);
router.post('/addCard',addCard);
// router.post('/create_charges',);

export default router;