const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authenticator = (req,res,next)=>{
    try{
    const token = req.header('Authorization');
    const user = (jwt.verify(token , 'itstoken' ))
    User.findById(user.userId).then(foundUser=>{
        req.user = foundUser ;
        next();
    })
    }
    catch(err){

    }
    

}