const mongoose = require("mongoose");
var bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  cookingId: {type: Number, default: 0},
  finishTime: {type: Date},
  washLoads: {type: Number, default: 0},
  date: { type: Date, default: Date.now },
  items: [
      {
          name:{type: String, required: true},
          quantity:{type: Number, default: 1},
          unit:{type: String, default: "gr"},
          image:{type: String},
          group:{type: String}
      }
  ],
  meals:[
    {
      id:{type: Number, required: true},
      image:{type: String},
      title:{type: String, required: true},
      readyInMinutes:{type: Number}
    }
  ]  
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user || !email) {
        var error = new Error('User not found.');
        error.status = 401;
        return callback(error);
      } 
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


const User = mongoose.model("User", UserSchema);

module.exports = User;