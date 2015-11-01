var express = require("express");
var router = new express.Router;

router.route("/").get(function (req, res) {
    res.render("index", {
        msg: req.flash()
    });
});

router.route("/info").get(function (req, res) {
    res.render("info");
});

module.exports = router;