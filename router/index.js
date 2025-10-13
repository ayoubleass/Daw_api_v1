import express from 'express';
import AuthController from '../Controllers/AuthController.js';
import {AuthMiddleware, LoginMiddleware, CreateAccoundMiddleware}  from '../Middlewares/AuthMiddleware.js';
const router = express.Router();


router.get('/login', LoginMiddleware,  AuthController.login);
router.post('/signUp',  CreateAccoundMiddleware, AuthController.createAccount); 
router.post('/logout', AuthMiddleware, AuthController.logout);




export default router;
