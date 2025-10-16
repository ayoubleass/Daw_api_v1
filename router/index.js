import express from 'express';
import AuthController from '../controllers/AuthController.js';
import ProjectController from '../controllers/ProjectController.js';
import FileController from '../controllers/FileController.js'
import {AuthMiddleware, LoginMiddleware, CreateAccoundMiddleware}  from '../Middlewares/AuthMiddleware.js';
const router = express.Router();

/*Authentication*/
router.get('/login', LoginMiddleware,  AuthController.login);
router.post('/signUp',  CreateAccoundMiddleware, AuthController.createAccount); 
router.post('/logout', AuthMiddleware, AuthController.logout);

/*Project Ends*/
router.post('/projects', AuthMiddleware, ProjectController.create);



/*AUDIO files*/
router.post('/projects/:projectId/clip/:clipId/audio', AuthMiddleware, FileController.save);




export default router;
