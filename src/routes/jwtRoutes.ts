
var express = require('express')
var router = express.Router();

var jwt = require('jsonwebtoken')
var passport = require("passport")

var { jwtAuthHeader } = require('../loaders/passportLoader')

module.exports = (app: any) => {
    jwtAuthHeader()

    app.use('/auth/jwt', router)

    // WITHOUT PASSPORT
    //      https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
    function generateAuthToken(username: string) {
        return jwt.sign({"username": username, "blorb": "korb"}, process.env.JWT_TOKEN_SECRET, { expiresIn: '1800s' });
    }
    router.post('/createNewAuthToken', (req: any, res: any) => {
        const token = generateAuthToken( req.body.username );

        // "When the client receives the token, they often want to store it for gathering user information in future requests."
        //      ???
        // get token from fetch request
        // const token = await res.json();

        // set token in cookie
        // document.cookie = `token=${token}`

        // console.log('token ', token)
        res.json({"token": token});
    })

    function authenticateToken(req: any, res: any, next: Function) {
        const authHeader = req.headers['authorization']
        const headerType = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]
      
        if (headerType != 'Bearer' || token == null) return res.sendStatus(401)

        // console.log('authToken ', token)
      
        // passport jwt strategy does this
        jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) {
                console.log('authenticateToken error: ', err) 
                return res.sendStatus(403)
            }

            req.user = user
        
            next()
        })
    }
    router.get('/checkAuthenticateToken', authenticateToken, (req: any, res: any) => {
        // executes after authenticateToken
        console.log('checkAuthenticateToken req.user ', req.user)
        res.json({message: 'checkAuthentication successful.'})
    })


    // WITH PASSPORT
    router.post('/passport', 
        passport.authenticate('jwtAuthHeader', { session: false }),
        (req: any, res: any) => {
            res.json({message: 'jwtPassport', "req.user": req.user, "req.headers.authorization": req.headers.authorization})
            // res.render('basic-session-response', {response: {message: 'jwt-passport', "req.user": req.user, "req.headers.authorization": req.headers.authorization}})
        }
    )
} // end module.exports