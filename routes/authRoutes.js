const express = require('express');
const { registerController, loginController, testController, forgotPassword } = require('../controller/authController');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

//password forgot route
router.post('/forgot', forgotPassword);

//test rout
router.get('/test', requireSignIn, isAdmin, testController);

router.get('/auth-route', requireSignIn, (req, res)=>{
     res.status(200).send({ok: true});
})

//dashboard route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({ok: true});
})

module.exports = router;