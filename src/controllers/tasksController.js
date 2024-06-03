import db from "../db.js";
import { ObjectId } from "mongodb";
let tasksCollection = db.collection("tasks");

export const getProjectTasks = async (req, res) => {
  try {
    const projectId = new ObjectId(req.query.projectId);
    const tasks = await tasksCollection
      .find({ project_id: projectId })
      .sort({ month_year: 1 })
      .toArray();

    if (!tasks.length) {
      return res.status(404).json({
        status: "fail",
        message: "No tasks found in this project.",
      });
    }

    const groupedTasks = tasks.reduce((acc, task) => {
      const monthYear = task.month_year;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(task);
      return acc;
    }, {});

    const project = Object.keys(groupedTasks).map((month) => ({
      month: month,
      tasks: groupedTasks[month],
    }));

    res.json(project);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching tasks.",
    });
  }
};
