
var jwt = require('jsonwebtoken')

//  https://www.geeksforgeeks.org/basic-authentication-in-node-js-using-http-header/
const basicAuthFunction = (req, res, next) => {
    var authheader = req.headers.authorization
    

    if (!authheader) {
    //     var err = new Error('You are not authenticated!');
    //     res.setHeader('WWW-Authenticate', 'Basic');
    //     err.status = 401;
    //     return next(err)
    // }
    } else {
        console.log('basicAuthFunction ', req.headers)
        res.render('response', {response: req.headers})
    }

    next()
}

const generateJwtAndCookie = (req, res) => {
    // generate jwt ...
    const token = jwt.sign({ _id: req.user._id, username: req.user.username }, process.env.JWT_TOKEN_SECRET)

    // ... and attach to response object
    res.cookie('authToken', token, 
        { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true, 
            maxAge: process.env.COOKIE_MAX_AGE 
        })
}

module.exports = {
    basicAuthFunction,
    generateJwtAndCookie
}