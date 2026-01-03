const Tour = require('./../models/tourModel');

// exports.checkID = (req, res, next, val) => {
//     if (req.params.id * 1 >= tours.length) {
//         return res.status(404).send({
//             status: 'failed',
//             message: 'invalid id'   
//         })   
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'failed',
//             message: 'missing name or price'
//         })
//     }
//     next();
// }

exports.getAllTours = async (req, res) => {
    try {
        //Filtering
        const queryObj = { ...req.query };

        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el])

        //Advanced filering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = Tour.find(JSON.parse(queryStr));
        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');       
        }


        const tours = await query;
        // .where('duration')
        // .equals('5') 
        // .where('difficulty')     
        // .equals('easy')

        res.status(200).send({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed'

        });
    }
}

exports.getSingleTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
        })
    }
}

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);

        res.status(200).json({
            status: 'succeed',
            data: {
                tour: newTour
            }
        })
    } catch (err) {

    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'invalid data sent'
        })
    }

}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'invalid data sent'
        })
    }

}   