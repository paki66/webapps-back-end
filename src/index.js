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


// endpointi za task

//endpointi za projekt

app.listen(port, () => console.log(`Slušam na portu ${port}`)) 