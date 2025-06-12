import express from 'express'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../Middleware/verifyToken.js';
import { getAllUsers, getUser, updateUser, userStats } from '../Controller/UserController.js';
const router=express.Router();


router.put('/:id',verifyTokenAndAuthorization,updateUser);

// Get User
router.get('/find/:id',verifyTokenAndAdmin,getUser);

//Get all Users
router.get('/',verifyTokenAndAdmin,getAllUsers);


//User Stats
router.get('/stats',verifyTokenAndAdmin,userStats);


export default router;