var express = require("express");
var router = new express.Router;
var passport = require("passport");

router.route("/auth/login")
.get(function (req, res) {
    res.render("auth/login", {
        msg: req.flash()
    });
})
.post(passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    badRequestMessage: "Hibás e-mail cím vagy jelszó."
}));

router.route("/auth/signup")
.get(function(req, res) {
    res.render("auth/signup", {
        msg: req.flash()
    }); 
})
.post(passport.authenticate("local-signup", {
    successRedirect:    "/",
    failureRedirect:    "/auth/signup",
    failureFlash:       true,
    badRequestMessage:  "Kérjük töltse ki a mezőket."
}));

router.use("/auth/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;