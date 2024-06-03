import express from "express";
import {
  getEmployeeProjects,
  getManagerProjects,
} from "../controllers/projectsController.js";
import { protect } from "../helpers/userHelper.js";

const projectsRouter = express.Router();

projectsRouter.get("/ownerProjects", protect, getManagerProjects);
projectsRouter.get("/employeeProjects", protect, getEmployeeProjects);

export default projectsRouter;
