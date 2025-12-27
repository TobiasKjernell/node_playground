import express from 'express'

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server side' })
})

app.post('/', (req, res) => res.send('You can post to this endpoint...'))

app.listen(port, () => console.log(`App running on port ${port}`));     