var express = require("express");
var router = new express.Router;
var funcs = require("./functions");

router.route("/history/histories").get(funcs.ensureAuthenticated, function (req, res) {
    req.app.models.history.find().then(function(histories) {
        res.render("history/histories", {
            histories: histories,
            msg: req.flash(),
            all: true
        });    
    });
});

router.route("/history/histories/:sourceaccount").get(funcs.ensureAuthenticated, function (req, res) {
    req.app.models.history.find({sourceaccount: req.params.sourceaccount}).then(function(histories) {
        res.render("history/histories", {
            histories: histories,
            msg: req.flash(),
            all: false
        }); 
    });
});

router.route("/history/delete/:id").get(funcs.ensureAuthenticated, function(req, res) {
    req.app.models.history.destroy({id: req.params.id}).then(function() {
        req.flash("success", "Számlatörténeti bejegyzés törölve.");
        res.redirect("/history/histories");
    });    
});

module.exports = router;