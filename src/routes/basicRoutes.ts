
var express = require('express')
var router = express.Router()

var User = require('../../db/model/user.model')

var passport = require("passport")
var { basicLocal }  = require('../loaders/passportLoader')
var jwt = require('jsonwebtoken')
var { generateJwtAndCookie } = require('../util/functions')

module.exports = (app: any) => {
    basicLocal()

    app.use('/auth/basic', router)

    router.post('/register', async (req: any, res: any) => {
        // check first if username already exists
        const currentUser = await User.findOne({ username: req.body.username })

        if(currentUser) {
            await req.flash('error', `User ${currentUser.username} already exists`)
            res.redirect('/auth/register')
        } else {
            try {
                const user = await User.create({ username: req.body.username, password: req.body.password, source: 'basicLocal' })
        
                //  After successful create, log user in. Log in redirects to app-surface
                req.login(user, function (err: Error) {
                    if (!err){
                        // 307 lets us redirect to the route in the codw below this one, as POST and not the default GET
                        //      this logs new user in, generates a JWT and redirects to the app-surface endpoint
                        res.redirect(307, '/auth/basic/login/passport')
                    } else {
                        let message = req.flash('error', err)
                        res.redirect('login')
                    }
                })
            } catch (error) {
                req.flash('error', error)
                res.redirect('/auth/register')
            }                    
        }
    })

    // Passport JS

    // https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
    //      Step 5 usw
    router.post( 
        "/login/passport",
        passport.authenticate("basicLocal", { 
            session: false ,
            failureRedirect: '/',
            failureFlash: true
        }),
        (req: any, res: any, next: Function) => {
            generateJwtAndCookie(req, res)

            res.redirect('/auth/app-surface')
        }
    )
} // end module.exports