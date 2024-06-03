import express from "express";
import { getProjectTasks } from "../controllers/tasksController.js";
import { protect } from "../helpers/userHelper.js";

const tasksRouter = express.Router();

tasksRouter.get("/getProjectTasks", protect, getProjectTasks);

export default tasksRouter;
