
const jwt = require('jsonwebtoken')

const generaterefreshToken =  (id) => {
    let first = id.toString()
    let token = jwt.sign(first, process.env.JWT_SCREET)
    return token
}

module.exports = {
    generaterefreshToken
}