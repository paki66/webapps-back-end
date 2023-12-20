import express from 'express'
import connnect from './db.js'
import cors from 'cors';
import data from './store.js';


const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/korisnici', (req, res) => res.json(data.korisnik));

// endpointi za m_izvjestaj
app.get('/izvjestaji', (req, res) => res.json(data.izvjestaj));

app.post('/izvjestaji', (req, res) => {
  res.statusCode = 201;
  res.setHeader('Location', '/izvjestaji/1234');
  res.send();
});

app.get('/izvjestaji/:id', (req, res) => {
  let izvjestajId = req.params.id;
  izvjestajId = parseInt(izvjestajId);
  izvjestajId -= 1;
  izvjestajId = String(izvjestajId);
  const izvjestaj = data.izvjestaj[izvjestajId];

  if (izvjestaj) {
      res.json(izvjestaj);
    } else {
      res.status(404).send('Report not found');
    }
});

app.delete('/izvjestaji/:id', (req, res) => {
let izvjestajId = req.params.id;
izvjestajId = parseInt(izvjestajId);
izvjestajId -= 1;
izvjestajId = String(izvjestajId);

  if (data.izvjestaj[izvjestajId]) {
    //delete data.izvjestaj[izvjestajId]; 
    res.status(204).send();
  } else {
    res.status(404).send('Report not found');
  }
})


app.listen(port, () => console.log(`Slušam na portu ${port}`)) 