import express from "express";
import cors from "cors";
import data from "./store.js";
import db from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/login/:email/:password", async (req, res) => {
  let email = req.params.email;
  let password = req.params.password;

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
app.get("/taskovi", async (req, res) => {
  let cursor = await db.collection("taskovi").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/taskovi", (req, res) => {
  let dodaniTask = req.body;
  res.statusCode = 201;
  res.json(dodaniTask);
  res.send();
});

app.get("/taskovi/id/:id", (req, res) => {
  let taskId = req.params.id;
  taskId = parseInt(taskId);
  taskId -= 1;
  taskId = String(taskId);
  const task = data.task[taskId];

  if (task) {
    res.json(task);
  } else {
    res.status(404).send("task not found");
  }
});

app.get("/taskovi/zaposlenik", (req, res) => {
  let zaposlenikIme = req.query.ime;
  let zaposlenikPozicija = req.query.pozicija;
  let sviTaskovi = data.task;
  let pripadajuciTaskovi = [];

  sviTaskovi.forEach((element) => {
    if (
      zaposlenikIme == element.korisnik.ime ||
      zaposlenikPozicija == element.korisnik.pozicija
    ) {
      pripadajuciTaskovi.push(element);
    }
  });
  res.json(pripadajuciTaskovi);
});

app.get("/taskovi/deadline", (req, res) => {
  let taskDeadline = req.query.deadline;
  let sviTaskovi = data.task;
  let pripadajuciTaskovi = [];

  sviTaskovi.forEach((element) => {
    if (taskDeadline == element.deadline) {
      pripadajuciTaskovi.push(element);
    }
  });
  res.json(pripadajuciTaskovi);
});

app.delete("/taskovi/:id", (req, res) => {
  let taskId = req.params.id;
  taskId = parseInt(taskId);
  taskId -= 1;
  taskId = String(taskId);

  if (data.task[taskId]) {
    //delete data.task[taskId];
    res.status(204).send();
  } else {
    res.status(404).send("task not found");
  }
});

app.put("/taskovi", (req, res) => {
  let task = req.body;
  data.task.forEach((element) => {
    if (task.id == element.id) {
      res.statusCode = 201;
      return res.json({
        succes: "task succesfully edited",
      });
    }
  });
  res.statusCode = 404;
  res.json({
    error: "task doesnt exist",
  });
  res.send();
});

app.put("/taskovi/zavrsen/:id/:sati", (req, res) => {
  let taskId = req.params.id;
  let utroseni_sati = req.params.sati;
  taskId = parseInt(taskId);
  taskId -= 1;
  taskId = String(taskId);

  data.task[taskId].stanje = "zavrsen";
  data.task[taskId].utroseno_sati = utroseni_sati;

  res.statusCode = 201;
  res.json(data.task[taskId]);
  res.send();
});

// endpointi za m_izvjestaj
app.get("/izvjestaji", async (req, res) => {
  let cursor = await db.collection("izvjestaji").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/izvjestaji", (req, res) => {
  let dodaniIzvjestaj = req.body;
  res.statusCode = 201;
  res.json(dodaniIzvjestaj);
  res.send();
});

app.get("/izvjestaji/:id", (req, res) => {
  let izvjestajId = req.params.id;
  izvjestajId = parseInt(izvjestajId);
  izvjestajId -= 1;
  izvjestajId = String(izvjestajId);
  const izvjestaj = data.izvjestaj[izvjestajId];

  if (izvjestaj) {
    res.json(izvjestaj);
  } else {
    res.status(404).send("Report not found");
  }
});

app.delete("/izvjestaji/:id", (req, res) => {
  let izvjestajId = req.params.id;
  izvjestajId = parseInt(izvjestajId);
  izvjestajId -= 1;
  izvjestajId = String(izvjestajId);

  if (data.izvjestaj[izvjestajId]) {
    //delete data.izvjestaj[izvjestajId];
    res.status(204).send();
  } else {
    res.status(404).send("Report not found");
  }
});

// endpointi za projekte
app.get("/projekti", async (req, res) => {
  let cursor = await db.collection("projekti").find();
  let results = await cursor.toArray();
  res.json(results);
});

app.post("/projekti", (req, res) => {
  let dodaniProjekt = req.body;
  res.statusCode = 201;
  res.json(dodaniProjekt);
  res.send();
});

app.get("/projekti/:id", (req, res) => {
  let projektId = req.params.id;
  projektId = parseInt(projektId);
  projektId -= 1;
  projektId = String(projektId);
  const projekt = data.projekt[projektId];

  if (projekt) {
    res.json(projekt);
  } else {
    res.status(404).send("project not found");
  }
});

app.delete("/projekti/:id", (req, res) => {
  let projektId = req.params.id;
  projektId = parseInt(projektId);
  projektId -= 1;
  projektId = String(projektId);

  if (data.projekt[projektId]) {
    //delete data.izvjestaj[izvjestajId];
    res.status(204).send();
  } else {
    res.status(404).send("Report not found");
  }
});

app.listen(port, () => console.log(`Slušam na portu ${port}`));
