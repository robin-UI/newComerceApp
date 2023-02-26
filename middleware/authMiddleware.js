const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const Users = require('../models/Users');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        
        token = req.headers.authorization.split(" ")[1]
        try {
            if(token){
                const decode = jwt.verify(token, process.env.JWT_SCREET)
                const user = await Users.findById(decode)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not Authrized token, Pleas login again")
        }
    }else{
        throw new Error("there is no toke in the header")
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const email =req.user.email;
    const adminUser = await Users.findOne({email})
    if(adminUser.role !== "admin"){
        throw new Error("You are not a admin")
    } else{
        next()
    }
}) 

module.exports = {
    authMiddleware,
    isAdmin
}