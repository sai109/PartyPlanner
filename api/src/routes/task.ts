import * as express from 'express';
import * as _ from 'lodash';
import { ITask, Task } from '../models/task';

const taskRouter: express.Router = express.Router();

taskRouter.post(
	'/create',
	async (req: express.Request, res: express.Response) => {
		req.body.taskname = req.body.taskname ? req.body.taskname : '';
		req.body.taskdesc = req.body.taskdesc ? req.body.taskdesc : '';
		req.body.taskduedate = Date.parse(req.body.taskduedate)
			? req.body.taskduedate
			: '';
		req.body.taskduetime = req.body.taskduetime ? req.body.taskduetime : '';
		req.body.taskcreator = req.body.taskcreator ? req.body.taskcreator : '';
		req.body.taskcompleted = req.body.taskcompleted
			? req.body.taskcompleted
			: false;

		try {
			const taskToAdd = {
				taskname: req.body.taskname,
				taskdesc: req.body.taskdesc,
				taskduedate: req.body.taskduedate,
				taskduetime: req.body.taskduetime,
				taskcreator: req.body.taskcreator,
				taskcompleted: req.body.taskcompleted,
			};
			const newTask: ITask = new Task(taskToAdd);
			await newTask.save();
			res.status(200).json({ id: newTask._id, ...taskToAdd });
		} catch (e) {
			res.status(500).json('Oops something went wrong');
		}
	}
);

//get task data to edit the task
taskRouter.get(
	'/edit/:id',
	async (req: express.Request, res: express.Response) => {
		try {
			const foundTask = await Task.findById(req.params.id);
			if (_.isEmpty(foundTask)) {
				res.status(400).json('An exact party like this already exists');
			} else {
				res.status(200).json({ party: foundTask });
			}
		} catch (e) {
			res.status(500).json('Oops something went wrong');
		}
	}
);

// get tasks that they are the creator of
taskRouter.get(
	'/my-tasks/:id',
	async (req: express.Request, res: express.Response) => {
		try {
			const idTofind = req.params.id;
			const foundCreatedTasks = await Task.find({ taskcreator: idTofind });
			if (_.isEmpty(foundCreatedTasks)) {
				res.status(400).send('You have no tasks');
			} else {
				const results = foundCreatedTasks.map( (task: ITask) => ({
					id: task._id,
					taskname: task.taskname,
					taskdesc: task.taskdesc,
					taskduedate: task.taskduedate,
					taskduetime: task.taskduetime,
					taskcreator: task.taskcreator,
					taskcompleted: task.taskcompleted,
				}));
				console.log(results);
				res.status(200).json(results);
			}
		} catch (e) {
			res.status(500).json('Oops something went wrong');
		}
	}
);

taskRouter.delete(
	'/:id',
	async (req: express.Request, res: express.Response) => {
		const taskID = req.params.id;
		try {
			const delTask = await Task.findByIdAndDelete(taskID);
			if (!delTask) {
				res.status(400).send('No task of this id exists');
			} else {
				res.status(200).json(delTask);
			}
		} catch (e) {
			res.status(500).json('Oops something went wrong');
		}
	}
);

export default taskRouter;