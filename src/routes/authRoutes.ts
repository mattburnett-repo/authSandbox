
var passport = require("passport")
var { jwtCookie } = require('../loaders/passportLoader')

var express = require('express');
var router = express.Router();

module.exports = (app: any) => {
    jwtCookie()

    // nail down root / index / login endpoint independent of other routes
    //  app.get, not router.get
    // TODO: remember me functionality
    //      https://www.zacfukuda.com/blog/passport-hashing-remember
    app.get('/', async (req: any, res: any) => {
        const success = await req.consumeFlash('success')
        const error = await req.consumeFlash('error')

        res.render('login', { success, error })
    })

    app.use('/auth', router)

    router.get('/register',  async (req: any, res: any) => {
        const success = await req.consumeFlash('success')
        const error = await req.consumeFlash('error')
        res.render('register', { success, error} )
    })

    // example protected route
    router.get('/dashboard', 
        passport.authenticate('jwtCookie', { 
            session: false,
            failureRedirect: '/',
            failureFlash: true 
        }),
        async (req: any, res: any) => {
            res.render('dashboard', { 
                response: {
                    message: 'Build out some kind of flex / grid thing with boxes / access for each accessLevel', 
                    authToken: req.cookies.authToken, 
                    user: req.user
                }})
        }
    )

    // this is the main / only logout endpoint
    router.post('/logout', async (req: any, res: any) => {
        // FIXME: logout() breaks flash messaging
        //      set req.user / res.session.passport = null to approximate what logout() does
        //          without removing session stuff

        // await req.logout((err: Error, next: Function) => { 
        //     if (err) { return next(err); } 
        // })

        req.user = null
        req.session.passport = null
        res.clearCookie('authToken')
        await req.flash('success', 'You are now logged out.')
        res.redirect('/')       
    })
} // end module.exports
