import { Delete, Login, register } from '../Controller/AuthController.js';
import { verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
import express from 'express';
const router=express.Router();


router.post('/register',register);

router.post('/login',Login);

router.delete('/:id',verifyTokenAndAuthorization,Delete)

export default router;