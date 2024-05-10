import db from "../db.js";

export const postProject = async (req, res) => {
  const addedProject = req.body;
  const name = addedProject["name"];

  if (await db.collection("projects").countDocuments({name: name}) == 0) {
    const cursor = await db.collection("projects").insertOne(addedProject);
    res.statusCode = 201;
    res.json(addedProject).send;
  }
  else {
    res.status(400).send("Project with that name already exists!").send;
  }
}

export const putProject = async (req, res) => {
  const name = req.params.name;
  const newName = req.body.name;

  const put = await db.collection("projects").updateOne({name: name}, {$set: {name: newName}});

  const cursor = await db.collection("projects").find({name: newName});
  const result = await cursor.toArray();
  res.json(result);
}

export const deleteProject = async (req, res) => {
  const name = req.params.name;
  if (await db.collection("projects").countDocuments({name: name}) > 0) {
    const cursor = await db.collection("projects").deleteOne({name: name});
    res.status(200).send("Project deleted!");
  } else {
    res.status(404).send("Project not found");
  }
}
