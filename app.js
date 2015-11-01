var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var flash = require("connect-flash");
var validator = require("express-validator");
var passport = require(__dirname + "/config/passport");

var router = require(__dirname + "/routes/router");
var authRouter = require(__dirname + "/routes/auth");
var adminRouter = require(__dirname + "/routes/admin");
var accountRouter = require(__dirname + "/routes/account");
var userRouter = require(__dirname + "/routes/user");
var transferRouter = require(__dirname + "/routes/transfer");
var historyRouter = require(__dirname + "/routes/history");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "secreet msg",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    };
}

app.use(setLocalsForLayout());

app.use(flash());
app.use(validator());
app.use(router);
app.use(authRouter);
app.use(adminRouter);
app.use(accountRouter);
app.use(userRouter);
app.use(transferRouter);
app.use(historyRouter);
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

module.exports = app;