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

export const postTask = async (req, res) => {
  const addedTask = req.body;
  const cursor = await db.collection("tasks").insertOne(addedTask);
  res.statusCode = 201;
  res.json(addedTask).send;
};

export const putTask = async (req, res) => {
  const name = req.body.name;
  const report = req.body.report;
  const task = req.body;

  const put = await db.collection("tasks").updateOne(
    { name: name, report: report },
    {
      $set: {
        category: task.category,
        deadline: task.deadline,
        expected_time: task.expected_time,
        name: task.name,
        report: task.report,
        status: task.status,
        user_email: task.user_email,
      },
    }
  );

  const cursor = await db
    .collection("tasks")
    .find({ name: task.name, report: task.report });
  const result = await cursor.toArray();
  res.json(result);
};

export const patchTask = async (req, res) => {
  const name = req.body.name;
  const report = req.body.report;
  const taken_time = req.body.taken_time;

  const patch = await db
    .collection("tasks")
    .updateOne(
      { name: name, report: report },
      { $set: { status: "completed", taken_time: taken_time } }
    );
  const cursor = await db
    .collection("tasks")
    .find({ name: name, report: report });
  const result = await cursor.toArray();
  res.json(result);
};

export const deleteTask = async (req, res) => {
  const name = req.body.name;
  const report = req.body.report;
  if (
    (await db
      .collection("tasks")
      .countDocuments({ name: name, report: report })) > 0
  ) {
    const cursor = await db
      .collection("tasks")
      .deleteOne({ name: name, report: report });
    res.status(200).send("Task deleted!");
  } else {
    res.status(404).send("Task not found");
  }
};
