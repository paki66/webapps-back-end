import express from "express";
import db from "../db.js";

const reportsRouter = express.Router()

reportsRouter.get("/history", async (req, res) => {
  let cursor = await db.collection("reports").find();
  let results = await cursor.toArray();
  res.json(results);
});

reportsRouter.get("/", async (req, res) => {
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

reportsRouter.get("/current", async (req, res) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const dateString = `${year}-${month}`;

  let cursor = await db.collection("reports").find({month: {$gt: dateString}});
  let results = await cursor.toArray();
  res.json(results);
});

reportsRouter.post("/", async (req, res) => {
  let addedReport = req.body;
  let cursor = await db.collection("reports").insertOne(addedReport);
  res.statusCode = 201;
  res.json(addedReport).send;
});



reportsRouter.delete("/:project/:name", async (req, res) => {
  let name = req.params.name;
  let project = req.params.project;
  if (await db.collection("reports").countDocuments({name: name, project: project}) > 0) {
    let cursor = await db.collection("reports").deleteOne({name: name, project: project});
    res.status(200).send("Report deleted!");
  } else {
    res.status(404).send("Report not found");
  }
});

reportsRouter.put("/", async (req, res) => {
  let name = req.body.name;
  let project = req.body.project;
  let report = req.body;

  let put = await db.collection("reports").updateOne({name: name, project: project},
    {$set: {month: report.month, name: report.name, project: report.project, tasks: report.tasks, user_email: report.user_email}});

  let cursor = await db.collection("reports").find({name: report.name, project: report.project});
  let result = await cursor.toArray();
  res.json(result);
})

export default reportsRouter;