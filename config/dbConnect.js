const mongoose = require('mongoose');


mongoose.set('strictQuery', false);
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log("Connect to mongo Successfuly");
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect;