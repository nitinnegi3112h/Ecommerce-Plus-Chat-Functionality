import express from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import { getMessage } from "../Controller/MessageController.js";
const router =express.Router();


router.post('/getMessage',verifyToken,getMessage);

export default router;