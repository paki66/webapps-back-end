import express from "express";
import {postProject, putProject, deleteProject} from "../controllers/projectsController.js";

const projectsRouter = express.Router()

projectsRouter.post("/", postProject);

projectsRouter.put("/:name", putProject);

projectsRouter.delete("/:name", deleteProject);

export default projectsRouter;