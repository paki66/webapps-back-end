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

export const postProject = async (req, res) => {
  const title = req.body.name;
  const owner = new ObjectId(req.body.owner);
  const addedProject = { title, owner };

  if ((await db.collection("projects").countDocuments({ title: title })) == 0) {
    const cursor = await db.collection("projects").insertOne(addedProject);
    res.statusCode = 201;
    res.json(addedProject).send;
  } else {
    res.status(400).send("Project with that name already exists!").send;
  }
};

export const putProject = async (req, res) => {
  const name = req.params.name;
  const newName = req.body.name;

  const put = await db
    .collection("projects")
    .updateOne({ name: name }, { $set: { name: newName } });

  const cursor = await db.collection("projects").find({ name: newName });
  const result = await cursor.toArray();
  res.json(result);
};

export const deleteProject = async (req, res) => {
  const name = req.params.name;
  if ((await db.collection("projects").countDocuments({ name: name })) > 0) {
    const cursor = await db.collection("projects").deleteOne({ name: name });
    res.status(200).send("Project deleted!");
  } else {
    res.status(404).send("Project not found");
  }
};
