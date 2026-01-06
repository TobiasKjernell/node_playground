const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name!'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour must have lesser than 40 characters or equal'],
        minlength: [10, 'A tour must have more than 10 characters or equal'],
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour should have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },  
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1 or equal'],
        max: [5, 'Rating must be below 5 or equal']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price!']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    slug: String,
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//Virtual, not going into database. Only sends a extra custom data field to client
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//Middleware before saving, (Post() is after)
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

//Middleware query, 'find' processes the query, not the document
tourSchema.pre(/^find/, function () {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now();
})

tourSchema.post(/^find/, function () {
    console.log(`Query took ${Date.now() - this.start} ms`)
})

// Aggregation middleware    
tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    console.log(this.pipeline());
});

const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;