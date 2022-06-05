
var express = require('express');
var router = express.Router();

var passport = require("passport")
var { oauthGoogle, oauthGithub } = require('../loaders/passportLoader')
var jwt = require('jsonwebtoken')

var { generateJwtAndCookie } = require('../util/functions')

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
            generateJwtAndCookie(req, res)
                   
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
            generateJwtAndCookie(req, res)
                             
            res.redirect('/auth/app-surface')
    })
} // end module.exports