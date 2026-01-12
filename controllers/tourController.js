const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const mongoose = require('mongoose')
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
    req.url =
        "/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5";
    next();
};


exports.getAllTours = catchAsync(async (req, res, next) => {

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
})

exports.getSingleTour = catchAsync(async (req, res, next) => {

    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidObjectId) return next(new AppError(`The tour is not found with the id.`, 404));

    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
        status: 'succeed',
        data: {
            tour: newTour
        }
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {

    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidObjectId) return next(new AppError(`The tour is not found with the id.`, 404));

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
})

exports.deleteTour = catchAsync(async (req, res, next) => {

    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidObjectId) return next(new AppError(`The tour is not found with the id.`, 404));

    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats,
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([{
        $unwind: '$startDates'
    },
    {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        }
    },
    {
        $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
        }
    },
    {
        $addFields: { month: '$_id' }
    },
    {
        $project: {
            _id: 0
        }
    },
    {
        $sort: { numTourStarts: -1 }
    },
    {
        $limit: 12
    }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})