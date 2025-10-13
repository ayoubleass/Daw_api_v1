import express from 'express';
import dbClient from './utils/db.js';
import router from './router/index.js';
import redisClient from './utils/redis.js';
const app = express()
const PORT= process.env.PORT || 3000;
const redisUrl = 'redis://172.19.252.252:6379';
const cred = "YXlvdWJAZ21haWwuY29tOjEyMzQ1Njc4OQo=";
const baseUrl = '/api/v1';


(async () => {
	await dbClient.connect();
	await redisClient.connect(redisUrl);
	app.use(express.json());
	app.use((err, req, res, next) => {
		console.error(err.stack);
		res.status(err.statusCode || 500).json({
			status: 'error',
			message: err.message || 'Internal Server Error',
		});
	});
	if (dbClient.isAlive() && redisClient.isAlive()) {
		app.use(baseUrl, router);
		app.listen(PORT, () => {
	  		console.log(`Server listening on port ${PORT}`);
		});
	} else {
		throw new Error("Can't connect to the database");
	}
	
}) ();





