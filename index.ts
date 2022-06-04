
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./src/server.ts')

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Auth sandbox server listening on port ${PORT}`)
})

module.exports = app;