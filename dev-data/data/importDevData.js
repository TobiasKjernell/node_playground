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
const tours = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'))     ;

//IMPORT DATA TO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Successfully uploaded')
    } catch (err) {

    }
}

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
       try {
        await Tour.deleteMany();
        console.log('Successfully uploaded')
    } catch (err) {
        
    }
}
