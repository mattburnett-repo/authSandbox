
const mongoose = require('mongoose')
const db = process.env.MONGO_CONNECTION_STRING + '/' + process.env.AUTH_DATABASE_NAME

module.exports = {
  connectToMongoose: async (callback) => {
    mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    (error) => {
      if (error) console.log(error)
    }

    console.log('Connected to Mongoose')
  }
};