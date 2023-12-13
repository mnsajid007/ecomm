const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./model/db');
const morgan = require('morgan');
const authRoute = require('./routes/authRoutes');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const cors = require('cors')

dbConnect();

const app = express();
app.use(cors());

//middleware
app.use(express.json());
app.use(morgan('dev'));

dotenv.config();

// routes

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

const por = process.env.PORT || 8080;

app.listen(por, ()=>{
    console.log(`server is running on ${por}`);
});
