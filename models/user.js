const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const SALT = 10;

var userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, rquired: true},
	createdAt: {type: Date, default: Date.now},
	firstName: String,
	lastName: String,
	bio: String
});
userSchema.methods.name = function(){
	return this.firstName +" "+this.lastName || this.username;
};

userSchema.pre("save", function(done){
	var user = this;
	if(!user.isModified("password")){
		done();
	}
	bcrypt.genSalt(SALT, function(err, salt){
		if(err){
			done(err);
		}
		bcrypt.hash(user.password, salt, function(){}, function(err, hashedPassword){
			if(err){
				done(err)
			}
			user.password = hashedPassword;
			done()
		})
	})
})
userSchema.methods.validatePassword = function(val, done){
	bcrypt.compare(val, this.password, function(err, isMatch){
		return done(err, isMatch);
	})
}
var User = mongoose.model("User", userSchema);

module.exports = User;