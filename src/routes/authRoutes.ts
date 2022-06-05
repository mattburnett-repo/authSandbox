
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

    // protected route
    router.get('/app-surface', 
        passport.authenticate('jwtCookie', { 
            session: false,
            failureRedirect: '/',
            failureFlash: true 
        }),
        async (req: any, res: any) => {
            // this is where your app begins. you can replace this code to plug in your app's entrypoint here.
            // 'app-surface' receives a JWT authToken via a cookie. You should probably take this token 
            //      and use it in an 'Authorization: Bearer your.token.here' header, in your app.
            res.render('app-surface', {    
                response: {
                    message: 'This is where the application appears. This is the surface area of the application.', 
                    authToken: req.cookies.authToken, 
                    user: req.user
                }})
        }
    )

    // this is the main / only logout endpoint
    router.post('/logout', async (req: any, res: any) => {
        // logout() breaks flash messaging
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
