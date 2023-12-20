import express from 'express'
import connnect from './db.js'
import cors from 'cors';
import data from './store.js';


const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

// endpointi za projekte
app.get('/projekti', (req, res) => res.json(data.projekt));

app.post('/projekti', (req, res) => {
  let dodaniProjekt = req.body;
  res.statusCode = 201;
  res.json(dodaniProjekt);
  res.send();
});

app.get('/projekti/:id', (req, res) => {
  let projektId = req.params.id;
  projektId = parseInt(projektId);
  projektId -= 1;
  projektId = String(projektId);
  const projekt = data.projekt[projektId];

  if (projekt) {
      res.json(projekt);
    } else {
      res.status(404).send('project not found');
    }
});

app.delete('/projekti/:id', (req, res) => {
let projektId = req.params.id;
projektId = parseInt(projektId);
projektId -= 1;
projektId = String(projektId);

  if (data.projekt[projektId]) {
    //delete data.izvjestaj[izvjestajId]; 
    res.status(204).send();
  } else {
    res.status(404).send('Report not found');
  }
})


app.listen(port, () => console.log(`Slušam na portu ${port}`)) 