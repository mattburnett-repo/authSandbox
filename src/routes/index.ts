
const authRouter = require('./authRoutes.ts')
const basicRouter = require('./basicRoutes.ts');
const oAuthRouter = require('./oAuthRoutes.ts')
//  const auth0Router = require('./auth0Routes.ts)
const jwtRouter = require('./jwtRoutes.ts')

const flashRoutes = require('./flashRoutes.ts')

const { initializePassport } = require('../loaders/passportLoader')

module.exports = (app: any) => {
    initializePassport(app)
    authRouter(app)
    basicRouter(app)
    oAuthRouter(app)
    // auth0Router(app)
    jwtRouter(app)
    flashRoutes(app)
}