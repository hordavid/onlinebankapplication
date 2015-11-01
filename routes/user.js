var express = require("express");
var router = new express.Router;
var funcs = require("./functions");
var bcrypt = require('bcryptjs');

router.route("/user/profile").get(funcs.ensureAuthenticated, function(req, res) {
    res.render("user/profile", {
        msg:req.flash()
    });
});

router.route("/user/changepass/:id").post(funcs.ensureAuthenticated, function(req, res) {
    if(req.body.newpassword !== req.body.confirmpass) {
        req.flash("error", "A két jelszó nem egyezik!");
        res.redirect("/user/profile");
    } else {
        req.app.models.user.findOne({id: req.params.id}).then(function(user) {
            if(user.validPassword(req.body.oldpassword)) {
                bcrypt.hash(req.body.newpassword, 10, function(err, hash) {
                    if(err) {
                        req.flash("error", "Sikertelen jelszó módosítás.");
                        res.redirect("/user/profile");
                    }
                    req.app.models.user.update({
                        id: req.params.id
                    }, {
                        password: hash
                    }).then(function() {
                        req.flash("success", "Sikeres jelszó módosítás.");
                        res.redirect("/user/profile");
                    });
                });
            } else {
                req.flash("error", "Hibás jelszó!");
                res.redirect("/user/profile");
            }
        });
    }
        
});

module.exports = router;