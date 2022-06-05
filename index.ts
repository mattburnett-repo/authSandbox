
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./src/server.ts')

const AUTH_PORT = process.env.AUTH_PORT || 4000;

app.listen(AUTH_PORT, () => {
  console.log(`Auth sandbox server listening on port ${AUTH_PORT}`)
})

module.exports = app;