const fs = require('fs');
const Tour = require('../../models/tourModel')
const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
}).then(() =>
    console.log('DB Connection successfull!')
)

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA TO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Successfully uploaded')
    } catch (err) {
        console.log(err);
    }
    throw new Error('Exiting')
}

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Successfully deleted')
    } catch (err) {
        console.log(err);
    }
    throw new Error('Exiting')
}

if (process.argv[2] === '--import')
    importData();
else if (process.argv[2] === '--delete')
    deleteData();

console.log(process.argv);