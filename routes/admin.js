var express = require("express");
var router = new express.Router;
var passport = require("passport");
var funcs = require("./functions");

router.route("/admin/signup")
.get(function(req, res) {
    res.render("admin/signup", {
        msg: req.flash()
    });
})
.post(passport.authenticate("local-admin-signup", {
    successRedirect:    "/",
    failureRedirect:    "/admin/signup",
    failureFlash:       true,
    badRequestMessage:  "Kérjük töltse ki a mezőket."
}));

router.route("/admin/users").get(funcs.ensureAuthenticated, funcs.andRestrictTo("admin"), function(req, res) { 
    req.app.models.user.find().then(function(users) {
        res.render("user/users", {
            users: users,
            msg: req.flash()
        });
    });
});

router.route("/admin/accounts").get(funcs.ensureAuthenticated, funcs.andRestrictTo("admin"), function(req, res) {
    req.app.models.account.find().then(function(accounts) {
        res.render("account/accounts", {
            accounts: accounts,
            msg: req.flash(),
        });    
    });
});

router.route("/admin/histories").get(funcs.ensureAuthenticated, funcs.andRestrictTo("admin"), function (req, res) {
    req.app.models.history.find().then(function(histories) {
        res.render("history/histories", {
            histories: histories,
            msg: req.flash(),
            all: true
        });    
    });
});

router.route("/user/deleteuser/:id").get(/*funcs.ensureAuthenticated, funcs.andRestrictTo("admin"),*/ function(req, res) {
    req.app.models.user.destroy({
        id: req.params.id    
    }).then(function() {
        req.flash("success", "Profil törölve.");
        res.redirect("/admin/users");
    });  
});

module.exports = router;