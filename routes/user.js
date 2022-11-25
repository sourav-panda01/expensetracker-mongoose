const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


router.post('/signin', userController.signin);

//router.post('/password/forgotpassword',userController.forgotpassword);
router.post('/signup',userController.signup);



module.exports = router;
