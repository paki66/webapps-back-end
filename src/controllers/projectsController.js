import db from "../db.js";
import { ObjectId } from "mongodb";
let projectsCollection = db.collection("projects");
let tasksCollection = db.collection("tasks");

//za dropdown
export const getManagerProjects = async (req, res) => {
  try {
    const owner = new ObjectId(req.query.userId);
    const projects = await projectsCollection
      .find({ owner: owner })
      .sort({ title: 1 })
      .toArray();
    if (projects) {
      res.status(200).json({
        status: "success",
        message: "Projects successfully retrieved.",
        data: projects,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No projects found.",
      });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching manager projects.",
    });
  }
};

export const getEmployeeProjects = async (req, res) => {
  try {
    const userId = new ObjectId(req.query.userId);
    const allProjects = await projectsCollection.find({}).toArray();
    const tasks = await tasksCollection.find({ employee: userId }).toArray();

    if (!tasks.length) {
      return res.status(404).json({
        status: "fail",
        message: "No tasks found for this user.",
      });
    }
    const projectIds = [
      ...new Set(tasks.map((task) => task.project_id.toString())),
    ];
    const uniqueProjectIds = projectIds.map((id) => new ObjectId(id));
    const filteredProjects = allProjects.filter((project) =>
      uniqueProjectIds.some((uniqueId) => uniqueId.equals(project._id))
    );

    if (filteredProjects.length) {
      res.status(200).json({
        status: "success",
        message: "Projects successfully retrieved.",
        data: filteredProjects,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No projects found.",
      });
    }
  } catch (error) {
    console.error("Error fetching employee projects:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching employee projects.",
    });
  }
};
