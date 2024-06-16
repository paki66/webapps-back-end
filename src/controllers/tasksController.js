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
      return res.json(null);
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
  const project_id = new ObjectId(req.body.projectId);
  const employee = new ObjectId(req.body.employee);
  const title = req.body.title;
  const month_year = req.body.month_year;
  const taken_time = req.body.taken_time;
  const expected_time = parseInt(req.body.expected_time);
  const status = req.body.status;
  const category = req.body.category;
  const deadline = new Date(req.body.deadline);
  const newTask = {
    project_id,
    employee,
    title,
    month_year,
    taken_time,
    expected_time,
    status,
    category,
    deadline,
  };

  if ((await tasksCollection.countDocuments({ title: title })) == 0) {
    const cursor = await tasksCollection.insertOne(newTask);
    res.statusCode = 201;
    res.json(newTask).send;
  } else {
    res.status(400).send("Task with that name already exists!").send;
  }
};

export const putTask = async (req, res) => {
  const _id = new ObjectId(req.body.taskId);
  if (await tasksCollection.findOne({ _id: _id })) {
    const cursor = await tasksCollection.updateOne(
      { _id: _id },
      {
        $set: {
          project_id: new ObjectId(req.body.projectId),
          _id: new ObjectId(req.body.taskId),
          employee: new ObjectId(req.body.employee),
          title: req.body.title,
          month_year: req.body.month_year,
          taken_time: req.body.taken_time,
          expected_time: parseInt(req.body.expected_time),
          status: req.body.status,
          category: req.body.category,
          deadline: new Date(req.body.deadline),
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Task successfully updated.",
    });
  } else {
    res.status(404).send("Task not found!").send;
  }
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
