import fs from 'fs';
import path from 'path';
import dbClient from '../utils/db.js';
import {ObjectId} from 'monogodb';


class FileController {
	
	static MAIN_FOLDER = '/users';

	
	static getClipContent = async (req, res) => {
		const userId = req.user.id;
		const porojectId = req.params.id;
		const collection = dbClient.collection('projects');
		const project = await collection.findOne({ _id: new ObjectId(projectId)});
		const {clipId } = req.body;
		if (!project) {
			return res.status(404).json({
				status: 404,
				error : 'Not found',
			});
		}
		let filePath = null;
		//filePath = track.clips.find((clip) => clip._id === new Object(clipId)

		try {
			if (!fs.existsSync(filePath)) {
				return res.status(404).json({ error: 'Audio file not found' });
			}
			const file = await fs.readdir(filePath);
			const stat = fs.statSync(filePath);
			res.setHeader('Content-Length', stat.size);
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);

		} catch (err) {
			console.error('Audio error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}


	static getFileInfo = async (req, res, next) => {
		
	}

	static save = async (req, res, next) => {
		const {file, projectId} = req.body;
		const FOLDER_NAME =  `${MAIN_FOLDER}/${userId}/projects/${projectId}/audio`;
		const dir = path.dir(FOLDER_NAME);
		try {
			if (!fs.existsSync(FOLDER_NAME)) {
				await fs.mkdir(dir, { recursive: true });
			}
			const filePath = `${FOLDER_NAME}/file.name`;
			await fs.writeFile(filePath, file.content);

			return res.status(200).json({
				status : 200,
				message :'File was saved !',
			});

		} catch (err) {
			return res.status(500).json({
				status: 500,
				error: err.message,
			});
		}
	}

	
	static update = async (req, res, next) => {

	}



	static delFile = async (req, res, next) => {

	}

}
