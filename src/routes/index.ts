
const authRouter = require('./authRoutes.ts')
const basicAuthRouter = require('./basicAuthRoutes.ts');
const oAuthRouter = require('./oAuthRoutes.ts')
//  const auth0Router = require('./auth0Routes.ts)
const jwtRouter = require('./jwtRoutes.ts')

const flashRoutes = require('./flashRoutes.ts')

const { initializePassport } = require('../loaders/passportLoader')

module.exports = (app: any) => {
    initializePassport(app)
    authRouter(app)
    basicAuthRouter(app)
    oAuthRouter(app)
    // auth0Router(app)
    jwtRouter(app)
    flashRoutes(app)
}