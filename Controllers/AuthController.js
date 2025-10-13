import dbClient from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import sha1 from 'sha1';
import redisClient from '../utils/redis.js';


class AuthController {
	/**
	 * The createAccount method is responsible of creating a new user account.
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
	 * 
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
