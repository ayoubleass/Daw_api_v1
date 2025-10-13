const Mangodb = require('./db.js');




const dbClient = Mangodb;

const currentTime = performance.now();

const waitConnection = () => {
	const maxTime = 10000;
	return new Promise((resolve, reject) => {
			const interId = setInterval(() => {
				const now = performance.now();
				const elapsedTime = now - currentTime;
				if (elapsedTime >= maxTime) {
					clearInterval(interId);
					reject();
				}
				if (dbClient.isAlive()) {
					clearInterval(interId);
					resolve(dbClient);
				}
				
			});
	}, 1000);
}


waitConnection()

