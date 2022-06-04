
var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
var GitHubStrategy = require('passport-github2').Strategy
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../../db/model/user.model')

const initializePassport = (app) => {
    app.use(passport.initialize())
    app.use(passport.session())

    //  When we serialize a user, Passport takes that user id and stores it internally on req.session.passport 
    //      which is Passport’s internal mechanism to keep track of things.
    passport.serializeUser((user, done) => {
        const userObject = {
            id: user._id,
        }
        done(null, userObject)
    })
    passport.deserializeUser(async (user, done) => {
        User.findById({ _id: user.id }, function (err, user) {
          if(err) return done(err)
          done(null, user)
        })
    })
}


const basicLocal = () => {
    passport.use(
        'basicLocal',
        new LocalStrategy(
            async (username, password, done) => {
                const currentUser = await User.findOne( { username })

                if(!currentUser) {
                    return done(null, false, { message: `${username} is not a registered user. Try again, or sign up.`})
                } else {                   
                    if(! await currentUser.isValidPassword(password)) {
                        return done(null, false, { message: `Password for user: ${username} is not valid. Try again.`})
                    } else {
                        return done(null, currentUser)
                    }
                }    
            }
        )
    )
}

const oauthGoogle = () => {
    passport.use(
        'oauthGoogle',
        new GoogleStrategy(
            {
                callbackURL: process.env.GOOGLE_REDIRECT_URL,
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET
            },
            async (accessToken, refreshToken, profile, done) => {
                User.findOrCreate(
                    { googleId: profile.id }, 
                    {
                        googleId: profile.id,
                        password: '',
                        email: profile.emails[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        profilePhoto: profile.photos[0].value,
                        source: 'google'
                    },
                    (err, user) => { return done(err, user) }
                )
            }
        )
    )
} 

const oauthGithub = () => {
    passport.use(
        'oauthGithub',
        new GitHubStrategy(    
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_REDIRECT_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            User.findOrCreate(
                { githubId: profile.id },
                {
                    githubId: profile.id,
                    password: '',
                    email: profile.emails[0].value,
                    githubUsername: profile.username,
                    source: 'github'
                },
                (err, user) => { return done(err, user) }
            )
         })
    )
}

const jwtCookie = () => {
    passport.use(
        'jwtCookie',
        new JwtStrategy(
            {
                // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                jwtFromRequest: req => req.cookies.authToken, 
                secretOrKey: process.env.JWT_TOKEN_SECRET
            },
            async (jwt_payload, done) => {
                User.findOne({username: jwt_payload.username}, function(err, user) {
                        if (err) {
                            return done(err, false, { message: err}) 
                        }
                        if (user) {

                            return done(null, user);
                        } else {
                            return done(null, false, { message: `Not logged in`});
                        }
                    }
                )
            }
        )
    )
}

const jwtAuthHeader = () => {
    passport.use(
        'jwtAuthHeader',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                // jwtFromRequest: req => req.cookies.authToken, 
                secretOrKey: process.env.JWT_TOKEN_SECRET
            },
            async (jwt_payload, done) => {
                User.findOne({username: jwt_payload.username}, function(err, user) {
                        if (err) return done(err, false) 

                        if (user) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                )
            })
    )
}

// TODO: make sure this is correctly / completely implemented
function isAuthenticated(req, res, next) {   
    if(req.isAuthenticated()) { 
        ('req.isAuthenticate()')
        return next()
    }
}

module.exports = {
    initializePassport,
    basicLocal,
    oauthGoogle,
    oauthGithub,
    jwtCookie,
    jwtAuthHeader,
    isAuthenticated
}