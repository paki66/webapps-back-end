import express from 'express'
import connnect from './db.js'
import cors from 'cors';
import data from './store.js';


const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Slušam na portu ${port}`)) 