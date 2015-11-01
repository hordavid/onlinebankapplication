var accountNumberLength = 17;

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        req.flash("warning", "Az oldal csak bejelentkezett ügyfeleink részére érhető el.");
        res.redirect('/auth/login');
    },
    andRestrictTo: function(role) {
        return function(req, res, next) {
            if (req.user.role == role) {
                next();
            } else {
                res.status(403).render("admin/not");
            }
        };
    }, 
    generator: function() {
        var numberStr = "";
        for(var count = 0; count < accountNumberLength; ++count) {
            if(count !== 8) numberStr += Math.floor((Math.random() * 9) + 1);
            else numberStr += "-";
        }
        numberStr += "-00000000";
        return numberStr;
    }
};