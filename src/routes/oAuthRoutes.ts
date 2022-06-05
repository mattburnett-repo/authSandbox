
var express = require('express');
var router = express.Router();

var passport = require("passport")
var { oauthGoogle, oauthGithub } = require('../loaders/passportLoader')
var jwt = require('jsonwebtoken')

// var { generateJwtAndCookie } = require('../util/functions')

module.exports = (app: any) => {
    oauthGoogle()
    oauthGithub()

    app.use('/auth/oauth', router)

    // GOOGLE
    router.get('/google', passport.authenticate('oauthGoogle', 
        { session: false, scope: ['profile', 'email'] })
    )
    router.get('/google/redirect', passport.authenticate('oauthGoogle', 
        { 
            session: false, 
            failureRedirect: '/error' 
        }),
        (req: any, res: any) => {
            // FIXME: replace this with a function or something...
            // generateJwtAndCookie(req, res)
            const token = jwt.sign(
                { 
                    _id: req.user._id, 
                    username: req.user.username,
                }, 
                process.env.JWT_TOKEN_SECRET)

            // ... and send back to caller
            res.cookie('authToken', token, 
                { 
                    httpOnly: true, 
                    sameSite: 'None', 
                    secure: true, 
                    maxAge: 5 * 60 * 1000 
                })           
            
            res.redirect('/auth/app-surface')
        }
    )

    // GITHUB
    router.get('/github', passport.authenticate('oauthGithub', { scope: [ 'user:email' ] }))
    router.get('/github/callback', passport.authenticate('oauthGithub', 
        { 
            session: false, 
            failureRedirect: '/error' 
        }),
        (req: any, res: any) => {
            // FIXME: replace this with a function or something...
            // generateJwtAndCookie(req, res)
            const token = jwt.sign({ _id: req.user._id, username: req.user.username }, process.env.JWT_TOKEN_SECRET)

            // ... and send back to caller
            res.cookie('authToken', token, 
                { 
                    httpOnly: true, 
                    sameSite: 'None', 
                    secure: true, 
                    maxAge: 5 * 60 * 1000 
                })           
                        
            res.redirect('/auth/app-surface')
    })
} // end module.exports