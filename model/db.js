const mongoose = require('mongoose');

const dbConnect = async() =>{
    try {
        const conn = await mongoose.connect('mongodb+srv://sajid:sajid@cluster0.j6ccbsj.mongodb.net/ecomm')
        console.log(conn.connection.host);
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = dbConnect;