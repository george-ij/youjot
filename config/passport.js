const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Load user model
const User = mongoose.model("users")

module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, {
            errorMsg: 'No user found'
          })
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw { errorMsg: err }
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, {
              errorMsg: "Password Incorrect",
              email: email
            })
          }
        })
      })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
