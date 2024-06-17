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

tasksRouter.post("/", protect, postTask);

tasksRouter.put("/", protect, putTask);

tasksRouter.patch("/completed", patchTask);

tasksRouter.delete("/", protect, deleteTask);

export default tasksRouter;
