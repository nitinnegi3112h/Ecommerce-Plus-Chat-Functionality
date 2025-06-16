import { Delete, ForgotPassword, Login, register } from '../Controller/AuthController.js';
import { verifyToken, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
import express from 'express';
const router=express.Router();


router.post('/register',register);

router.post('/login',Login);

router.delete('/:id',verifyTokenAndAuthorization,Delete)
router.post('/forgotPassword',verifyToken,ForgotPassword)

export default router;