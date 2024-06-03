import express from "express";
import {
  getProjectTasks,
  putTask,
  postTask,
  patchTask,
  deleteTask,
} from "../controllers/tasksController.js";
import { protect } from "../helpers/userHelper.js";

const tasksRouter = express.Router();
tasksRouter.get("/getProjectTasks", protect, getProjectTasks);

tasksRouter.post("/", postTask);

tasksRouter.put("/", putTask);

tasksRouter.patch("/completed", patchTask);

tasksRouter.delete("/", deleteTask);

export default tasksRouter;
