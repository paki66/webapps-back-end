import express from "express";
import cors from "cors";
import data from "./store.js";
import db from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let cursor = await db.collection("users").find({email: email, password: password});
  let results = await cursor.toArray();

  if (results.length == 0) {
    res.status(404).send("Login failed!");
  }
  else {
    res.json(results);
  }
})

app.post("/signup", async (req, res) => {
  let addedUser = req.body;
  let email = addedUser["email"];

  if (await db.collection("users").countDocuments({email: email}) == 0) {
    let cursor = await db.collection("users").insertOne(addedUser);
    res.statusCode = 201;
    res.json(addedUser).send;
  }
  else {
    res.status(400).send("User with that email already exists!").send;
  }
});


app.get("/users/status", async (req, res) => {
  const projection = {name: 1, status: 1, surname: 1}; 
  let cursor = await db.collection("users").find({}).project(projection);
  let results = await cursor.toArray();
  res.json(results);
});

app.delete("/users/:email", async (req, res) => {
  let email = req.params.email;

  if (await db.collection("users").countDocuments({email: email}) > 0) {
    let cursor = await db.collection("users").deleteOne({email: email});
    res.status(200).send("User deleted!");
  } else {
    res.status(404).send("User not found");
  }
});

app.patch("/users/status/:email", async (req, res) => {
  let email = req.params.email;
  let body = req.body;
  let userStatus = body.status;  
  let patch = await db.collection("users").updateOne({email: email},{$set: {status: userStatus}});
  let cursor = await db.collection("users").find({email: email});
  let result = await cursor.toArray();
  res.json(result);
});

app.patch("/users/password/:email", async (req, res) => {
  let email = req.params.email;
  let old_password = req.body.old_password;
  let new_password = req.body.new_password;
  if (await db.collection("users").countDocuments({email: email, password: old_password}) > 0) {
    let patch = await db.collection("users").updateOne({email: email, password: old_password},{$set: {password: new_password}});
    let cursor = await db.collection("users").find({email: email});
    let result = await cursor.toArray();
    res.json(result);
  }
  else {
    res.status(400).send("Wrong password or email");
  }
});

app.patch("/users/info/:email", async (req, res) => {
  let email = req.params.email;
  let body = req.body;
  let patch = await db.collection("users").updateOne({email: email},{$set: {name: body.name, surname: body.surname, email: body.email}});
  let cursor = await db.collection("users").find({email: body.email});
  let result = await cursor.toArray();
  res.json(result);
});


//endpointi za task
app.get("/tasks/:report", async (req, res) => {
  let report = req.params.report;
  let cursor = await db.collection("tasks").find({report: report});
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/tasks", async (req, res) => {
  let addedTask = req.body;
  let cursor = await db.collection("tasks").insertOne(addedTask);
  res.statusCode = 201;
  res.json(addedTask).send;
});

app.delete("/tasks", async (req, res) => {
  let name = req.body.name;
  let report = req.body.report;
  if (await db.collection("tasks").countDocuments({name: name, report: report}) > 0) {
    let cursor = await db.collection("tasks").deleteOne({name: name, report: report});
    res.status(200).send("Task deleted!");
  } else {
    res.status(404).send("Task not found");
  }
});

app.get("/tasks", async (req, res) => {
  let userEmail = req.query.email;
  let name = req.query.name;
  let query = {
    $and: [
      {"user_email": {$regex: new RegExp(userEmail, 'i')}}, 
      {"name": {$regex: new RegExp(name, 'i')}}
    ]
  };

  let cursor = await db.collection("tasks").find(query);
  let results = await cursor.toArray();
  res.json(results);
});

app.put("/tasks", async (req, res) => {
  let name = req.body.name;
  let report = req.body.report;
  let task = req.body;

  let put = await db.collection("tasks").updateOne({name: name, report: report},
    {$set: {category: task.category, deadline: task.deadline, expected_time: task.expected_time, name: task.name, report: task.report, 
      status: task.status, user_email: task.user_email}});

  let cursor = await db.collection("tasks").find({name: task.name, report: task.report});
  let result = await cursor.toArray();
  res.json(result);
});

app.patch("/tasks/completed", async (req, res) => {
  let name = req.body.name;
  let report = req.body.report;
  let taken_time = req.body.taken_time;

  let patch = await db.collection("tasks").updateOne({name: name, report: report},{$set: {status: "completed", taken_time: taken_time}});
  let cursor = await db.collection("tasks").find({name: name, report: report});
  let result = await cursor.toArray();
  res.json(result);
});

app.patch("/tasks/expired", async (req, res) => {
  let name = req.body.name;
  let report = req.body.report;

  let patch = await db.collection("tasks").updateOne({name: name, report: report},{$set: {status: "expired"}});
  let cursor = await db.collection("tasks").find({name: name, report: report});
  let result = await cursor.toArray();
  res.json(result);
});

// endpointi za m_izvjestaj
app.get("/reports/history", async (req, res) => {
  let cursor = await db.collection("reports").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.get("/reports", async (req, res) => {
  let project = req.query.project;
  let name = req.query.name;
  let query = {
    $and: [
      {"project": {$regex: new RegExp(project, 'i')}}, 
      {"name": {$regex: new RegExp(name, 'i')}}
    ]
  };
  let cursor = await db.collection("reports").find(query);
  let results = await cursor.toArray();
  res.json(results);
});

app.get("/reports/current", async (req, res) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const dateString = `${year}-${month}`;

  let cursor = await db.collection("reports").find({month: {$gt: dateString}});
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/reports", async (req, res) => {
  let addedReport = req.body;
  let cursor = await db.collection("reports").insertOne(addedReport);
  res.statusCode = 201;
  res.json(addedReport).send;
});



app.delete("/reports/:project/:name", async (req, res) => {
  let name = req.params.name;
  let project = req.params.project;
  if (await db.collection("reports").countDocuments({name: name, project: project}) > 0) {
    let cursor = await db.collection("reports").deleteOne({name: name, project: project});
    res.status(200).send("Report deleted!");
  } else {
    res.status(404).send("Report not found");
  }
});

app.put("/reports", async (req, res) => {
  let name = req.body.name;
  let project = req.body.project;
  let report = req.body;

  let put = await db.collection("reports").updateOne({name: name, project: project},
    {$set: {month: report.month, name: report.name, project: report.project, tasks: report.tasks, user_email: report.user_email}});

  let cursor = await db.collection("reports").find({name: report.name, project: report.project});
  let result = await cursor.toArray();
  res.json(result);
})

// endpointi za projekte
app.get("/projects", async (req, res) => {
  let cursor = await db.collection("projects").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/projects", async (req, res) => {
  let addedProject = req.body;
  let name = addedProject["name"];

  if (await db.collection("projects").countDocuments({name: name}) == 0) {
    let cursor = await db.collection("projects").insertOne(addedProject);
    res.statusCode = 201;
    res.json(addedProject).send;
  }
  else {
    res.status(400).send("Project with that name already exists!").send;
  }
});

app.delete("/projects/:name", async (req, res) => {
  let name = req.params.name;
  if (await db.collection("projects").countDocuments({name: name}) > 0) {
    let cursor = await db.collection("projects").deleteOne({name: name});
    res.status(200).send("Project deleted!");
  } else {
    res.status(404).send("Project not found");
  }
});

app.listen(port, () => console.log(`Slušam na portu ${port}`));
