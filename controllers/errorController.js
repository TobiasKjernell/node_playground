const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}
const handleDuplicatedFieldsDB = err => {
    const value = err.keyValue.name;
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400)
}
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}   
    
const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        console.error('ERROR 💣', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

exports.module = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(res, err);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        console.log(error);
        if (err.name === "CastError") error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicatedFieldsDB(error);
        if (err.name === "ValidationError") error = handleValidationErrorDB(error);

        sendErrorProd(res, error);
    }

}