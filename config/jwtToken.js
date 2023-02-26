const jwt = require('jsonwebtoken')

const generateToken =  (id) => {
    let first = id.toString()
    let token = jwt.sign(first, process.env.JWT_SCREET)
    return token
}

module.exports = {
    generateToken
}