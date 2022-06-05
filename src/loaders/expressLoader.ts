
var express = require('express')
var bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
var session = require('express-session')

// https://www.npmjs.com/package/express-flash-message
const { flash } = require('express-flash-message')
const path = require('path')

const MongoStore = require('connect-mongo')

module.exports = (app: any) => {
  app.set('views', './src/views')
  app.set('view engine', 'pug')

  // static / public (html, etc). html resulting from pug-cli in views. don't forget to copy css files
  //    compile in the src/views dir ---> pug -w . --out ../../public -P
  // app.use(express.static('public', {index: "login.html"}))
  app.use(express.static('public'))

  // body parser. to handle POST requests
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())
  app.use(cookieParser())

  // session
  app.set('trust proxy', 1)
  app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,                // don't save session if unmodified
      saveUninitialized: false,     // don't create session until something stored

      //  https://www.npmjs.com/package/express-flash-message  --->
      //  cookie secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. 
      //    In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
      //      set to true for Mongo, set to false for express-flash-messages
      //      not sure we are even using Mongostore / sessions, now that jwt is implemented
      //  also disabled 'sameSite' because it was also interfering with express-flash-messages
      cookie: { 
        maxAge: process.env.COOKIE_MAX_AGE,  // time before cookie expires / mongo datastore removes session
        // secure: true, 
        // sameSite: 'none'
      }, 
      store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_CONNECTION_STRING,
        dbName: process.env.AUTH_DATABASE_NAME,
        collectionName: 'sessions'
      }),
      crypto: {
        secret: process.env.SESSION_SECRET
      }
    })
  )

  app.use(flash())

} // end module.exports