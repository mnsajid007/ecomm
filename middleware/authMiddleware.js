const JWT = require('jsonwebtoken');
const userModel = require('../model/userModel');

// protect user login

exports.requireSignIn = async(req, res, next) => {

    try {
        const decode = await JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }

}

exports.isAdmin = async(req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(301).send({
                success: false,
                message: 'unAuthorized accesss'
            })
        }else{
            next();
        }

    } catch (error) {
        console.log(error);
        return res.status(301).send({
            success: false,
            message: 'error in admin middleware',
            error
        })
    }
}