var express = require("express");
var router = new express.Router;
var funcs = require("./functions");

router.route("/account/transfer")
.get(funcs.ensureAuthenticated, function (req, res) {
    req.app.models.account.find({user: req.user.id, active: true}).then(function(accounts) {
        res.render("account/transfer", {
            accounts: accounts,
            msg: req.flash()
        });    
    });
})
.post(funcs.ensureAuthenticated, function(req, res) {
    var sourceAccountNumber = req.body.sourceaccount;
    var targetAccountNumber = req.body.targetaccount;
    var amount = parseInt(req.body.amount, 10);
    
    if(sourceAccountNumber === targetAccountNumber) {
        req.flash("error", "Azonos számlaszámok!");
        res.redirect("/account/transfer");
    } else if (amount < 1 || isNaN(amount)) {
        req.flash("error", "Hibás összeg!");
        res.redirect("/account/transfer"); 
    } else {
        req.app.models.account.findOne({number: sourceAccountNumber}).then(function(sourceaccount) {
            var balance = parseInt(sourceaccount.balance, 10);
            if(balance < amount) {
                req.flash("error", "Nem áll rendelkezésre elegendő összeg a forrás számláján.");
                res.redirect("/account/transfer");
            } else {
                req.app.models.account.update({
                    number: sourceAccountNumber    
                }, {
                    balance: (balance - amount)
                }).then(function() {
                    req.app.models.history.create({
                       sourceaccount: sourceAccountNumber,
                       targetaccount: targetAccountNumber,
                       amount: amount,
                       currency: sourceaccount.currency,
                       increase: false
                    }).then(function() {
                        req.app.models.account.findOne({number: req.body.targetaccount}).then(function(targetaccount) {
                            var balance = parseInt(targetaccount.balance, 10);
                            req.app.models.account.update({
                                number: targetAccountNumber    
                            }, {
                                balance: (balance + amount)
                            }).then(function() {
                                req.app.models.history.create({
                                   sourceaccount: targetAccountNumber,
                                   targetaccount: sourceAccountNumber,
                                   amount: amount,
                                   currency: targetaccount.currency,
                                   increase: true
                                }).then(function() {
                                    req.flash("success", "Sikeres tranzakció.");
                                    res.redirect("/account/transfer");
                                });
                            });
                        });    
                    });
                });
            }
        });
    }    
});

module.exports = router;