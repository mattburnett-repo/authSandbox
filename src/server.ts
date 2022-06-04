
var express = require('express')
var server = express();

var db = require('../db/connection')

db.connectToMongoose(function (err: Error) {
  if(err) {
    console.error(err)
    process.exit()
  }
})

const loaders = require('./loaders/index.ts')
loaders(server); 

module.exports = server;