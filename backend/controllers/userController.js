const asynchandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrpt = require('bcryptjs')

const User = require('../models/userModel')
// @desc Register users
// @route POST /api/users
// @access public
const registerUser = asynchandler(async (req,res)=>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Name ,Email and Password required!");
    }

    //check if user exists
    const userExists = await User.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error('User already Exists')
    }

    //Hash Password
    const salt = await bcrpt.genSalt(10)
    const hashedPassword = await  bcrpt.hash(password,salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc login users
// @route POST /api/users/login
// @access public
const loginUser = asynchandler(async (req,res)=>{
    const {email,password} = req.body

    //check user exists
    const user = await User.findOne({email})

    if(user && (await bcrpt.compare(password,user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }


})

// @desc get users info
// @route GET /api/users/me
// @access private
const getMe = asynchandler(async (req,res)=>{
    const {_id, name , email} = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        name,
        email
    })
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}
module.exports={
    registerUser,
    loginUser,
    getMe
}