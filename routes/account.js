var express = require("express");
var router = new express.Router;
var funcs = require("./functions");

router.route("/account/accounts").get(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.account.find({user: req.user.id}).then(function(accounts) {
        res.render("account/accounts", {
            accounts: accounts,
            msg: req.flash(),
            all: true
        });    
    });
});

router.route("/account/create")
.get(funcs.ensureAuthenticated, function(req, res) {
    res.render("account/create", {
        msg: req.flash(),
        accountnumber: funcs.generator()
    }); 
})
.post(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.account.create({
        number: req.body.accountnumber,
        currency: req.body.currency,
        user: req.user
    }).then(function() {
        req.flash("success", "A virtuális számla elkészült és aktív.");
        res.redirect("/");
    });
});

router.route("/account/addmaster")
.get(funcs.ensureAuthenticated, function(req, res) {
    res.render("account/addmaster", {
        msg: req.flash()
    });
})
.post(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.account.findOne({master: true}).then(function(master) {
        if(master === undefined) {
            req.app.models.account.create({
                number: req.body.accountnumber,
                balance: Math.floor(((Math.random() * 10000000) + 1000000) / 10),
                currency: req.body.currency,
                master: true,
                user: req.user
            }).then(function() {
                req.flash("success", "A Fő számlát hozzáadtuk a fiókjához.");
                res.redirect("/");
            });
        } else {
            req.flash("warning", "Már adott meg fő számlát.");
            res.redirect("/account/addmaster");
        }    
    });
});

router.route("/account/delete/:id").get(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.account.destroy({
        id: req.params.id    
    }).then(function() {
        req.flash("success", "Számla törölve.");
        res.redirect("/account/accounts");
    });  
});

router.route("/account/active/:id").get(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.account.findOne({id: req.params.id}).then(function(account) {
        req.app.models.account.update({
            id: req.params.id
        }, {
            active: account.active ? false : true
        }).then(function() {
            res.redirect("/account/accounts");
        });     
    });
});

router.route("/account/balance").get(funcs.ensureAuthenticated, function (req, res) {
    req.app.models.account.find({user: req.user.id}).then(function(accounts) {
        res.render("account/balance", {
            accounts: accounts,
            all: true
        });
    });
});

router.route("/account/balance/:id").get(funcs.ensureAuthenticated, function (req, res) {
    req.app.models.account.findOne({id: req.params.id}).then(function(account) {
        res.render("account/balance", {
            accounts: account,
            msg: req.flash(),
            all: false
        });
    });
});

module.exports = router;