import express from 'express'
import connnect from './db.js'
import cors from 'cors';
import data from './store.js';


const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

// endpointi za korisnika
app.get('/korisnici', (req, res) => res.json(data.korisnik));

app.post('/korisnici', (req, res) => {
    let dodaniKorisnik = req.body;
    res.statusCode = 201;
    res.json(dodaniKorisnik);
    res.send();
});

app.get('/korisnici/:id', (req, res) => {
    let korisnikId = req.params.id;
    korisnikId = parseInt(korisnikId);
    korisnikId -= 1;
    korisnikId = String(korisnikId);
    const korisnik = data.korisnik[korisnikId];

    if (korisnik) {
        res.json(korisnik);
      } else {
        res.status(404).send('User not found');
      }
});

app.delete('/korisnici/:id', (req, res) => {
  let korisnikId = req.params.id;
  korisnikId = parseInt(korisnikId);
  korisnikId -= 1;
  korisnikId = String(korisnikId);

    if (data.korisnik[korisnikId]) {
      //delete data.korisnik[korisnikId]; 
      res.status(204).send();
    } else {
      res.status(404).send('User not found');
    }
})

//endpointi za task
app.get('/taskovi', (req, res) => res.json(data.task));

app.post('/taskovi', (req, res) => {
    let dodaniTask = req.body;
    res.statusCode = 201;
    res.json(dodaniTask)
    res.send();
});

app.get('/taskovi/id/:id', (req, res) => {
    let taskId = req.params.id;
    taskId = parseInt(taskId);
    taskId -= 1;
    taskId = String(taskId);
    const task = data.task[taskId];

    if (task) {
        res.json(task);
      } else {
        res.status(404).send('task not found');
      }
});

app.get('/taskovi/zaposlenik', (req, res) => {
    let zaposlenikIme = req.query.ime;
    let zaposlenikPozicija = req.query.pozicija;
    let sviTaskovi = data.task;
    let pripadajuciTaskovi = [];

    sviTaskovi.forEach((element) =>{
      if (zaposlenikIme == element.korisnik.ime || zaposlenikPozicija == element.korisnik.pozicija) {
        pripadajuciTaskovi.push(element);
      }
    });
    res.json(pripadajuciTaskovi);
});

app.get('/taskovi/deadline', (req, res) => {
  let taskDeadline = req.query.deadline;
  let sviTaskovi = data.task;
  let pripadajuciTaskovi = [];

  sviTaskovi.forEach((element) =>{
    if (taskDeadline == element.deadline) {
      pripadajuciTaskovi.push(element);
    }
  });
  res.json(pripadajuciTaskovi);
});

app.delete('/taskovi/:id', (req, res) => {
  let taskId = req.params.id;
  taskId = parseInt(taskId);
  taskId -= 1;
  taskId = String(taskId);

    if (data.task[taskId]) {
      //delete data.task[taskId]; 
      res.status(204).send();
    } else {
      res.status(404).send('task not found');
    }
})

app.put('/taskovi', (req, res) => {
    let task = req.body;
    data.task.forEach((element) => {
      if (task.id == element.id) {
        res.statusCode = 201;
        return res.json({
          succes: 'task succesfully edited',
        })
      }
    });
    res.statusCode = 404;
    res.json({
      error: 'task doesnt exist',
    });
    res.send();
});

app.put('/taskovi/zavrsen/:id/:sati', (req, res) => {
    let taskId = req.params.id;
    let utroseni_sati = req.params.sati;
    taskId = parseInt(taskId);
    taskId -= 1;
    taskId = String(taskId);

    data.task[taskId].stanje = 'zavrsen';
    data.task[taskId].utroseno_sati = utroseni_sati;

    res.statusCode = 201;
    res.json(data.task[taskId]);
    res.send();
});

app.listen(port, () => console.log(`Slušam na portu ${port}`)) 