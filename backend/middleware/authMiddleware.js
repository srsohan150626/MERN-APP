const jwt = require('jsonwebtoken')
const asynchandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asynchandler(async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
        //Get token from header
        token = req.headers.authorization.split(' ')[1]

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //get the user from the token
            req.user = await User.findById(decoded.id).select('-password')
            next()
        }catch (e) {
            console.log(e)
            res.status(401)
            throw new Error('Unauthorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Unauthorized, no token')
    }
})

module.exports = {protect}