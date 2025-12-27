import express from 'express'
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = 3000;

app.use(express.json())

const __dirname = dirname(fileURLToPath(import.meta.url));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
    res.status(200).send({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const getSingleTour = (req, res) => {   
    const id = req.params.id * 1;
    const tour = tours.find(item => item.id === id)

    if (!tour) {
        res.status(404).send({
            status: 'failed',
            message: 'invalid id'
        })
    }
    res.status(200).send({
        status: 'success',
        data: {
            tour
        }
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {
    console.log(req.params.id);
    if (req.params.id * 1 >= tours.length) {
        res.status(404).send({
            status: 'failed',
            message: 'invalid id'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here..'
        }
    })
}

const deleteTour = (req, res) => {
    console.log(req.params.id);
    if (req.params.id * 1 >= tours.length) {
        res.status(404).send({
            status: 'failed',
            message: 'invalid id'
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
}

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);


app.listen(port, () => console.log(`App running on port ${port}`));         