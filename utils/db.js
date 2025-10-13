import { MongoClient } from 'mongodb';


class MangoDb {

	constructor ()  {
		this.db = null;
		this.connected = false;
	}
	

	connect = async () => {
		try {
			const host = process.env.DB_HOST || 'localhost';
			const port = process.env.BD_PORT || 27017;
			const url = `mongodb://${host}:${port}`;
			const database = process.env.DB_DATABASE || 'daw';
			this.client = new MongoClient(url);
			await this.client.connect();
			this.connected = true;
			this.db = this.client.db(database);
			console.log("connected!!!");
		} catch(err) {
			console.error('Failed to connect to MongoDB', err);
		}

	}

	isAlive = () => {
		return this.connected;
	}
	
	
	collection = (name) => {
		return this.db.collection(name);
	}
	
}


const dbClient = new MangoDb();

export default dbClient;
