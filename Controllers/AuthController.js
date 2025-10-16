import dbClient from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import sha1 from 'sha1';
import redisClient from '../utils/redis.js';


class AuthController {
	/**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Create a new user account
   *     description: Register a new user with email and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *                 description: "User email address"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "mypassword123"
   *                 description: "User password (will be hashed)"
   *     responses:
   *       201:
   *         description: Account created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: "done your account has been created !"
   *       409:
   *         description: Email already exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 409
   *                 error:
   *                   type: string
   *                   example: "Email already exists"
   *       500:
   *         description: Internal server error
   */	
	static createAccount= async (req, res, next) => {
		try {
			const {email, password} = req.user;
			const collection = dbClient.collection('users');
			const user = await collection.findOne({email});
			if (user) {
				return res.status(409).json({
					status: 409,
					error : 'Email already exists',
				});
					
			}
			const newUser = await collection.insertOne({
				email,
				password : sha1(password),
			});
			return res.status(201).json({
				status: 201,
				message : 'done your account has been created !',
			});
		} catch(err) {
			next(err);
		}
	}

	/**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user and return access token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *                 description: "User email address"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "mypassword123"
   *                 description: "User password"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: "123e4567-e89b-12d3-a456-426614174000"
   *                   description: "Authentication token (valid for 24 hours)"
   *       401:
   *         description: Unauthorized - invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 401
   *                 error:
   *                   type: string
   *                   example: "Unauthorized"
   *       500:
   *         description: Internal server error
   */
	static login = async (req, res, next) => {
		try {
			const {email, password} = req.user;
			const collection = dbClient.collection('users');
			const user = await collection.findOne({email: email});
			if (!user) {
				return res.status(401).json({
					status: 401,
					error : 'Unauthorized'
				});	
			}
			const hashedPass = sha1(password);
			if (hashedPass !== user.password) {
				return res.status(401).json({ 
					status: 401,
					error: 'Unauthorized'
				});
			}
			const token = uuidv4();
			const key = `auth_${token}`;
			const duration = 60 * 60 * 24;
			await redisClient.setEx(key, user._id.toString(), duration);
			return res.status(200).json({ token });
		} catch(err) {
			next(err);
		}

	}

	/**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: User logout
   *     description: Invalidate user authentication token
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Logout successful - no content
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Internal server error
   */

	static logout = async (req, res, next) => {
		try {
			const key = `auth_${req.user.key}`;
			await redisClient.del(key);
			return res.status(204).json({});
		} catch (err) {
			next(err);
		}
	}
}

export default AuthController;
