import express from "express";
import {
  getEmployeeProjects,
  getManagerProjects,
  postProject,
  putProject,
  deleteProject,
} from "../controllers/projectsController.js";
import { protect } from "../helpers/userHelper.js";

const projectsRouter = express.Router();

projectsRouter.get("/ownerProjects", protect, getManagerProjects);
projectsRouter.get("/employeeProjects", protect, getEmployeeProjects);

projectsRouter.post("/", postProject);

projectsRouter.put("/:name", putProject);

projectsRouter.delete("/:name", deleteProject);

export default projectsRouter;
