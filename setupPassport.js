
const User = require("./models/user");
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");

module.exports = function(){

	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user)
		})
	});

	//pass the passport local strategy middleware only when the sign-up
	//button is clicked
	passport.use("signup", new localStrategy({
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},
	function(req, email, password, done){
		User.findOne({"email": email}, function(err, user){
			if(err){
				return done(err);
			}
			if(user){
				return done(null, false, req.flash("signUpMessage", "Username Already Exist"));
			}else{
				if(password !== req.body.password2){
					return done(null, false, req.flash("wrongPassword", "Password Doesn't Match"))
				}else{
					var newUser = new User({
						username: req.body.username,
						password: password,
						email: email,
						firstName: req.body.firstname,
						lastName: req.body.surname
					});
					newUser.save(function(err){
						if(err){
							return done(err);
						}else{
							return done(null, false, req.flash("createdAccount", "Account created Successfully, Login"));
						}
					})
				}
			}
		})
	}));

	//pass the passport local strategy middleware only when the login
	//button is clicked
	passport.use("login", new localStrategy({
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},function(req, email, password, done){
		User.findOne({"email": email}, function(err, user){
			if(err){
				return done(err);
			}
			if(!user){
				return done(null, false, req.flash("invalidUser", "User Doesn't Exist, Click the Sign-Up Button"))
			}else{
				user.validatePassword(password, function(err, isMatch){
					if(err){
						return done(err)
					}
					if(isMatch){
						return done(null, user);
					}else{
						return done(null, false, req.flash("invalidPassword", "Invalid Password"))
					}
				})
			}
		})
	}))
}