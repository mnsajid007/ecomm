const mongoose = require('mongoose');

const orderSchmea = new mongoose.Schema({
    // product: [
    //     {
    //     type: mongoose.ObjectId,
    //     ref: 'Product'
    // }],
    product: [
        {
        type: Object,
        require: [true, 'product required']
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        default: 'not process',
        enum: ['not process', 'process']
    }

},{timestamps:true});

const orderModel = mongoose.model('Order', orderSchmea);

module.exports = orderModel;