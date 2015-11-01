var passport = require("passport");
var LocalStrategy = require("passport-local");
var adminObject = require(__dirname + "/admin");

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use('local-signup', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },   
    function(req, email, password, done) {
        req.app.models.user.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: email + " e-mail címmel már regisztráltak." });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            });
        });
    }
));

passport.use("local-login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    function(req, email, password, done) {
        req.app.models.user.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: "Hibás e-mail cím vagy jelszó." });
            }
            return done(null, user);
        });
    }
));

passport.use('local-admin-signup', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },   
    function(req, email, password, done) {
        if(email !== adminObject.email || password !== adminObject.password) {
            return done(null, false, {message: "Hibás admin azonosítók!"});
        }
        req.app.models.user.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: "Az admin már létre lett hozva." });
            }
            req.app.models.user.create({
                email: adminObject.email,
                password: adminObject.password,
                firstname: adminObject.firstname,
                lastname: adminObject.lastname,
                address: adminObject.address,
                city: adminObject.city,
                role: adminObject.role
            })
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            });
        });
    }
));

passport.use("local-admin-login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    function(req, email, password, done) {
        req.app.models.user.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: "Hibás admin azonosítók." });
            }
            return done(null, user);
        });
    }
));


module.exports = passport;