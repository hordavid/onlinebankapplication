var Waterline = require("waterline");
var bcrypt = require('bcryptjs');

module.exports = Waterline.Collection.extend({
    identity: "user",
    connection: "disk",
    attributes: {
        email: {
            type: "string",
            required: true,
            unique: true,
        },
        password: {
            type: "string",
            required: true,
        },
        firstname: {
            type: "string",
        },
        lastname: {
            type: "string",
        },
        address: {
            type: "string",
        },
        city: {
            type: "string",
        },
        zipcode: {
            type: "integer",
        },
        role: {
            type: "string",
            enum: ["user", "admin"],
            required: true,
            defaultsTo: "user"
        },
        accounts: {
            collection: "account",
            via: "user"
        },
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
});