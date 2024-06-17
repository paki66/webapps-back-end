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
  try {
    const task = await tasksCollection.findOne({
      _id: new ObjectId(req.query.id),
    });
    if (task) {
      await tasksCollection.deleteOne({ _id: new ObjectId(req.query.id) });
      res.status(200).json({
        status: "success",
        message: "You have successfully deleted your task.",
      });
      return;
    } else {
      res.status(401).json({ status: "fail", message: "An error occured." });
      return;
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: console.error(error),
    });
  }
};

export const getTasksReports = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const monthYear = req.query.month_year;

    const tasks = await tasksCollection
      .find({
        project_id: new ObjectId(projectId),
        month_year: monthYear,
      })
      .toArray();

    const employeeData = {};
    const categoryData = {};

    tasks.forEach((task) => {
      const employeeId = task.employee.toString();
      const category = task.category;
      const status = task.status;
      const expectedTime = task.expected_time;
      const takenTime = task.taken_time ? task.taken_time : 0;

      // Employee Report
      if (!employeeData[employeeId]) {
        employeeData[employeeId] = {
          todo: 0,
          completed: 0,
          expired: 0,
          expectedHours: 0,
          takenHours: 0,
        };
      }

      if (status == 2) {
        employeeData[employeeId].expired += 1;
      } else if (status == 1) {
        employeeData[employeeId].completed += 1;
      } else if (status == 0) {
        employeeData[employeeId].todo += 1;
      }

      employeeData[employeeId].expectedHours += expectedTime;
      employeeData[employeeId].takenHours += takenTime;

      // Category Report
      if (!categoryData[category]) {
        categoryData[category] = {
          totalTasks: 0,
          todo: 0,
          completed: 0,
          expired: 0,
          expectedHours: 0,
          takenHours: 0,
        };
      }

      categoryData[category].totalTasks += 1;

      if (status == 2) {
        categoryData[category].expired += 1;
      } else if (status == 1) {
        categoryData[category].completed += 1;
      } else if (status == 0) {
        categoryData[category].todo += 1;
      }

      categoryData[category].expectedHours += expectedTime;
      categoryData[category].takenHours += takenTime;
    });

    const employeeReport = Object.keys(employeeData).map((employeeId) => ({
      employee: employeeId,
      ...employeeData[employeeId],
    }));
    const categoryReport = Object.keys(categoryData).map((category) => ({
      category,
      ...categoryData[category],
    }));

    res.status(200).json({
      employeeReport: Object.keys(employeeData).map((employeeId) => ({
        employee: employeeId,
        ...employeeData[employeeId],
      })),
      categoryReport: Object.keys(categoryData).map((category) => ({
        category,
        ...categoryData[category],
      })),
    });
  } catch (error) {
    console.error("Error fetching report data", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
