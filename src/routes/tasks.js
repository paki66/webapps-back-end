import express from "express";
import { putTask, postTask, patchTask, deleteTask } from "../controllers/tasksController.js";

const tasksRouter = express.Router()

tasksRouter.post("/", postTask);

tasksRouter.put("/", putTask);

tasksRouter.patch("/completed", patchTask);

tasksRouter.delete("/", deleteTask);

export default tasksRouter;