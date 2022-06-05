
# Auth Sandbox
This is an isolated environment to facilitate experimentation with / further learning about authentication and authorization tech. The idea is to sort out a workflow / familiar practice for using this tech, in order speed up future development efforts.

It is a simple Node / Express server that renders UI from PUG files. There is nothing fancy to look at; this is on purpose.

The code handles logging in. Once a user has registered / logged in, the code presents a endpoint called 'app-surface'. 'app-surface' is intended to be the entry / starting point of your application's code.

Users can register a new account.

Users can log in in two different ways:
* Basic Authentication (username / password)
* OAuth2
  * Google
  * GitHub

A MongoDB / Mongoose database is used to persist authentication / session info. You can use a different database if you want to, but you will need to change code in the routes.

## Technologies Used
* Node / Express
  * bcrypt
  * Express flash messaging
* MongoDB / Mongoose / mongoose-find-or-create
* Typescript
* PUG
* Passport JS
  * Basic authentication
  * OAuth2
    * Google
    * GitHub
  * JWT
  
## Getting Started
After downloading / cloning the repo
```bash
npm install
```
You will need environment vars
```bash
AUTH_PORT=4000
SESSION_SECRET=put.your.session.secret.string.here
MONGO_CONNECTION_STRING=put.your.mongo.connection.string.here (eg: mongodb://localhost:27017)
AUTH_DATABASE_NAME=authSandbox
COOKIE_MAX_AGE=in.total.milliseconds (eg: 1200000 = 20 mins.)

GOOGLE_CLIENT_ID=get.this.from.console.cloud.google.com
GOOGLE_CLIENT_SECRET=get.this.from.console.cloud.google.com
GOOGLE_REDIRECT_URL=something.like.http://localhost:4000/auth/google/redirect

GITHUB_CLIENT_ID=get.this.from.https://github.com/settings/application
GITHUB_CLIENT_SECRET=get.this.from.https://github.com/settings/application
GITHUB_REDIRECT_URL=something.like./auth/oauth/github/callback

JWT_TOKEN_SECRET=you.can.use.node.REPL.then.require('crypto').randomBytes(64).toString('hex') to make this
```
Run the server
```bash
npm run dev
```
If you need to recompile static PUG files (src/views/static/login.pug, register.pug), run (from project root)
```bash
npm run build:pug
```
Once everything is installed and running, go to your browser and type
```bash
http://localhost:4000
```
You should then see a Log In screen.

## Options
* Basic Local
  * Username / Password 
* OAuth2 
  * Google
  * GitHub
* auth0
  * still researching this
* JWT
  * For authorization / role / access level
  
## To Do
* Resolve simultaneous OAuth2 authentication puzzle
  * Use Google, logout and the use GitHub
    * still logs in with google
* PUG
  * modularize the duplicate bits of the templates
    * I think they're called mixins, or something like that
* Use MongoDB on Atlas, not locally
* More Typescript
* Research / implement auth0
* Dockerize / Deploy
  * Microservice / AWS
  * NPM package
* Tests?
