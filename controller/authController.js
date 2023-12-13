const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.registerController = async(req, res) => {

    try {

        const {name, email, password, phone, address, answer} = req.body;

        if(!name || !email || !password || !phone || !address || !answer){
          return res.status(400).send({
                    success: false,
                    message: 'invalid name or email'
            })
        }

        const existUser = await userModel.findOne({email});

        if(existUser){
            return res.status(401).send({
                success: false,
                message: 'email already exist'
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const register = new userModel({name, email, password:hashpassword, phone, address, answer});
        await register.save();

        return res.status(201).send({
            success: true,
            message: 'New user created',
            register
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in callback"
        })
    }

}

exports.loginController = async(req, res)=> {
    try {
        const {email, password} = req.body;

        if(!email || !password ){
            return res.status(400).send({
                      success: false,
                      message: 'email or password missing'
              })
          }

        const existUser = await userModel.findOne({email});

        if(!existUser){
            return res.status(401).send({
                success: false,
                message: 'user or email not exist'
            })
        }

        const pass = await bcrypt.compare(password, existUser.password);

        if(!pass){
            return res.status(401).send({
                success: false,
                message: 'password not matched'
            })
        }

        const token = await JWT.sign({_id:existUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        return res.status(201).send({
            success: true,
            message: 'user login success',
            user: existUser,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in callback of login"
        })
    }
}

exports.testController = async(req, res)=> {
    return res.send({
        message: 'protected route'
    })
}

exports.forgotPassword = async(req, res)=> {
   try {
    const {email, answer, password} = req.body;
    if(!email || !answer){
        return res.status(401).send({
            success: false,
            message: 'invalid email or answer'
        })
    }
    const user = await userModel.findOne({email, answer});
    if(!user){
        return res.status(401).send({
            success: false,
            message: 'email is not registered or wrong password'
        })
    }

    const hashpassword =  await bcrypt.hash(password, 10);
    await userModel.findByIdAndUpdate(user._id, {password:hashpassword});
    return res.status(201).send({
        success: true,
        message: 'password update success',
        user
    })

   } catch (error) {
    console.log(error);
    return res.status(500).send({
        success: false,
        message: 'password update success',
        user
    })
   }
}