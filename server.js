const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bluebird = require("bluebird");
const passport = require("passport");
const setupPassport = require("./setupPassport")
const logger = require("morgan");
const helmet = require("helmet");
//const enforcesSSL = require("express-enforces-ssl");

app = express()

var routes = require("./routes/router");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test");

//helmet setup
app.use(helmet.xssFilter());
app.use(helmet.frameguard("sameorigin"))
app.use(helmet.noSniff());

app.set("port", process.env.PORT || 3000);
app.set("views,", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.enable("trust proxy");
//app.use(enforcesSSL());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session())
setupPassport();

app.use(flash())
app.use(routes)

app.listen(app.get("port"), function(){
	console.log("Server Running on port "+app.get("port"))
});