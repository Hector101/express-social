const router = require("express").Router();
const passport = require("passport");
var User = require("../models/user");
var editMiddleware = require("../middlewares/middlewares");

router.use(function(req, res, next){
	//console.log(req.user)
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next()
});

router.get("/", function(req, res, next){
	User.find().sort({createdAt: "descending"})
	.exec(function(err, users){
		if(err){
			next(err);
		}
		res.render("index", {users: users})
	})
})

router.get("/signup", function(req, res){
	res.render("signup", {
		signUpMessage: req.flash("signUpMessage"),
		wrongPassword: req.flash("wrongPassword"),
		createdAccount: req.flash("createdAccount")
	});
})

router.post("/signup",
	passport.authenticate("signup", {
	successRedirect: "/signup",
	failureRedirect: "/signup",
	failureFlash: true
})
)
router.get("/login", function(req, res){
	res.render("login", {
		invalidPassword: req.flash("invalidPassword"),
		invalidUser: req.flash("invalidUser")
	});
})
router.post("/login",
	passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}))

router.get("/users/:user", function(req, res, next){
	User.findOne({username: req.params.user}, function(err, user){
		if(err){
			return next(err);
		}
		if(!user){
			return next(404);
		}
		res.render("profile", {user: user});
	});
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});
router.get("/edit", editMiddleware, function(req, res){
	res.render("edit");
});
router.post("/edit", editMiddleware, function(req, res, next){
	req.user.bio = req.body.bio;
	req.user.save(function(err){
		if(err){
			next(err)
		}
		return;
	})
	req.flash("info", "Profile Successfully Updated");
	res.redirect("/edit");
})

router.use(function(err, req, res, next){
	res.render("404");
})
module.exports = router;