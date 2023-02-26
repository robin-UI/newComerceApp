const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const { validateMongodb } = require('../utils/validateMongodbid');
const { generaterefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken')

let createUser = asyncHandler(async (req, res) => {

    const email = req.body.email;
    const isExist = await Users.findOne({email})
    if (isExist) {
        throw new Error("user already exist")
    } else {
        const newUser = await Users.create(req.body);
        res.json(newUser)
    }

});

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findUser = await Users.findOne({email})
    console.log(findUser);
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generaterefreshToken(findUser?._id)
        console.log(refreshToken);
        const updateToken = await Users.findByIdAndUpdate( 
            findUser._id,
            { refreshToken: refreshToken },
            { new: true }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge:  72 * 60 * 60 * 100,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else{
        throw new Error("Invalid credintials")
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    let refToken = req.cookies
    if(!refToken?.refreshToken) throw new Error("Could not any cookie")

    let refreshToken = refToken.refreshToken

    const user = await Users.findOne({refreshToken})
    // console.log(refreshToken);
    if(!user) throw new Error("No refrence toke in db") 

    jwt.verify(refreshToken,  process.env.JWT_SCREET, (err, decode) => {
        let id = user._id.toString()

        if(err || id !== decode) {
            throw new Error("there is something wrong with refresh token")
        }
        const accessToken = generateToken(user._id)
        res.json({accessToken})
    } )
    
})

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users)
    } catch (error) {
        throw new Error("Nothing find")
    }
})

const getAuser = asyncHandler(async (req, res) => {
    let id = req.user._id;
    validateMongodb(id)
    try {
        const user = await Users.findById(id)
        res.json({user})
    } catch (error) {
        throw new Error("Couldnot find this user")
    }
})

const deleteAuser = asyncHandler(async (req, res) => {
    let id = req.params.id;
    validateMongodb(id)
    try {
        console.log("delete user");
        const deleteduser = await Users.findByIdAndDelete(id)
        res.json({deleteduser})
    } catch (error) {
        throw new Error("Couldnot find this user")
    }
})

const updateUser = asyncHandler(async (req, res) => {
    let id = req.user._id;
    validateMongodb(id)
    try {
        const updateUser = await Users.findByIdAndUpdate(
            id,
            {...req.body},
            { new: true }
        )
        res.json(updateUser)
    } catch (error) {
        throw new Error("This is would not be updated");
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    validateMongodb(id)
    try {
        const blockUser = await Users.findByIdAndUpdate(
            id, { isBloked: true}, { new: true }
        )
        res.json({message: "User Boked"})
    } catch (error) {
        throw new Error("Could not Unblock this user")
    }
})


const unblockUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    validateMongodb(id)
    try {
        const unblockUser = await Users.findByIdAndUpdate(
            id, { isBloked: false}, { new: true }
        )
        res.json({message: "User unbloked"})
    } catch (error) {
        throw new Error("Could not Unblock this user")
    }
})

const logOut = asyncHandler(async (req, res) => {
    const cookie = req.cookies

    if (!cookie?.refreshToken) throw new Error("No Refresh token in cookies")
    const refreshToken = cookie.refreshToken
    console.log(refreshToken);
    const user = await Users.findOne( {refreshToken} );
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) //Forbidden
    }
    console.log(refreshToken);
    await Users.findByIdAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    }) 
    return res.sendStatus(204) //Forbidden
})

module.exports = {
    createUser,
    login,
    logOut,
    getAllUser,
    getAuser,
    deleteAuser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken
}