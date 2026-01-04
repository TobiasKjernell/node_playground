const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
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

exports.aliasTopTours = (req, res, next) => {
    req.url = req.url =
        "/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5";
    next();
};



exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;
    
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