import { createClient } from 'redis';

class RedisClient {

	constructor ()  {
		this.client = null;
		this.connected = false;
		this.url = null;

	}


	connect = async (url) => {
		if (!url) {
			throw new Error('To connect you must provide the url');	
		}
		this.client = createClient({
			url : url,
		});
		this.client.on('error', err => console.log('Redis Client Error', err));
		await this.client.connect();
		this.connected = true;
	}

	isAlive = () => {
		return this.connected;
	}


	get = async (key) => {
		return await this.client.get(key);
	}



	set = async (key, value)  => {
		await this.client.set(key, value);
	}


	setEx = async (key, value, duration) => {
		await this.client.setEx(key, duration, value);
	}


	del = async (key) => {
		await this.client.del(key);
	}


}



const redisClient = new RedisClient();
export default redisClient;
