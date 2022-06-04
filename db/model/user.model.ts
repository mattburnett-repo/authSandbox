
let mongoose = require("mongoose")
const findOrCreate = require('mongoose-find-or-create')
const bcrypt = require('bcrypt');

let Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: {
    type: String,
    default: null,
  },
  githubId: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  username: String,
  firstName: String,
  lastName: String,
  githubUsername: String,
  profilePhoto: String,
  password: String,
  source: { type: String, required: [true, "source not specified"] },
  accessLevel: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user' 
  },
  lastVisited: { type: Date, default: new Date() }
})

userSchema.pre(
  'save',
  async function(next: Function) {
    // @ts-ignore
    const user = this
    // @ts-ignore
    const hash = await bcrypt.hash(this.password, 10)
    
    // @ts-ignore
    this.password = hash 

    next()
  }
)
userSchema.methods.isValidPassword = async function(password: string) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

userSchema.plugin(findOrCreate)

var userModel = mongoose.model("user", userSchema, "user")

module.exports = userModel