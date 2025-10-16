import fs from 'fs';
import path from  'path';
import dbClient from '../utils/db.js';
import { ObjectId } from 'mongodb';


class ProjectController {
	
	  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: Create a new audio project
   *     description: Create a new Digital Audio Workstation project with tracks and audio clips
   *     tags: [Projects]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - bpm
   *               - tracks
   *             properties:
   *               name:
   *                 type: string
   *                 example: "project_2"
   *                 description: "Project name"
   *               bpm:
   *                 type: number
   *                 example: 120
   *                 description: "Beats per minute"
   *               version:
   *                 type: string
   *                 example: "2"
   *                 description: "Project version"
   *               pitch:
   *                 type: number
   *                 example: 0
   *                 description: "Project pitch"
   *               description:
   *                 type: string
   *                 example: "My awesome music project"
   *                 description: "Project description"
   *               tracks:
   *                 type: array
   *                 description: "Array of audio tracks"
   *                 items:
   *                   type: object
   *                   properties:
   *                     index:
   *                       type: number
   *                       example: 1
   *                       description: "Track position index"
   *                     name:
   *                       type: string
   *                       example: "drums"
   *                       description: "Track name"
   *                     color:
   *                       type: string
   *                       example: "green"
   *                       description: "Track color"
   *                     clips:
   *                       type: array
   *                       description: "Array of audio clips in the track"
   *                       items:
   *                         type: object
   *                         properties:
   *                           name:
   *                             type: string
   *                             example: "kick"
   *                             description: "Clip name"
   *                           playDuration:
   *                             type: number
   *                             example: 2
   *                             description: "Clip play duration"
   *                           width:
   *                             type: number
   *                             example: 100
   *                             description: "Clip visual width"
   *                           pitch:
   *                             type: number
   *                             example: 0
   *                             description: "Clip pitch adjustment"
   *                           mute:
   *                             type: boolean
   *                             example: false
   *                             description: "Whether clip is muted"
   *                           offset:
   *                             type: number
   *                             example: 2
   *                             description: "Clip offset"
   *                           gain:
   *                             type: number
   *                             example: 1
   *                             description: "Clip gain/volume"
   *                           pos:
   *                             type: object
   *                             description: "Clip position data"
   *                             properties:
   *                               top:
   *                                 type: number
   *                                 example: 1
   *                                 description: "Top position"
   *                               shiftRatio:
   *                                 type: number
   *                                 example: 2
   *                                 description: "Shift ratio"
   *                           startTime:
   *                             type: number
   *                             example: 10
   *                             description: "Clip start time"
   *                           endTime:
   *                             type: number
   *                             example: 10
   *                             description: "Clip end time"
   *     responses:
   *       200:
   *         description: Project created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "success"
   *                 project:
   *                   type: object
   *                   description: "The created project with generated IDs"
   *       400:
   *         description: Bad request - missing required fields
   *       500:
   *         description: Internal server error
   */
	static create = async (req, res, next) => {
		try {
			const {bpm, tracks, name, description, pitch, version} = req.body;
			const userId = req.user._id.toString();
			const projectId = new ObjectId()
			const folderName = `/users/${userId}/porjects/${projectId}/audio`;
			const projectCollection = await dbClient.collection('projects');
			const newTracks = [];
			tracks.forEach((track) => {
				const trackId = new ObjectId();
				const trackClips =  [];
				track.clips.forEach((clip) => {
					const path = folderName.concat('/',clip.name);
					const newClip = {
						_id: new ObjectId(),
						name: clip.name,
						playDuration: clip.playDuration,
						width: clip.width,
						pitch: clip.pitch,
						mute: clip.mute,
						offset: clip.offset,
						gain: clip.gain,
						pos: {
							top: clip.pos.top,
							shiftRatio: clip.pos.shiftRatio,
						},
						startTime: clip.startTime,
						endTime: clip.endTime,
						trackId : trackId,
						path: path,
					};
					trackClips.push(newClip);
				});
				const newTrack = {
					_id: trackId,
					index: track.index,
					name : track.name,
					color: track.color,
					projectId: projectId,
					clips: trackClips,
				};

				newTracks.push(newTrack);
			});
			const projectData = {
				_id: projectId,
				name: name,
				bpm,
				description,
				userId: req.user._id,
				pitch: pitch, 
				tracks: newTracks,
				createdAt: new Date(),
			};
			await projectCollection.insertOne(projectData);
			return res.status(200).json({
				status: 200,
				message: 'success',
				project: projectData,
			});
		} catch (err) {
			console.error(err.message);
			next(err);
		}
			
	}


}

export default ProjectController;
