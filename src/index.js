import express from 'express'

const app = express()
const port = 3000

let brojac = 0

app.get('/', (req, res) => {
    brojac++

    res.send(`Trenutna vrjednost je ${brojac}`)
})

app.listen(port, () => console.log(`Slušam na portu ${port}`)) 