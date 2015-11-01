var Waterline = require("waterline");

module.exports = Waterline.Collection.extend({
    identity: "account",
    connection: "disk",
    attributes: {
        number: "string",
        balance:  {
            type: "integer",
            defaultsTo: 0
        },
        currency: "string",
        master: {
            type: "boolean",
            defaultsTo: false
        },
        active:  {
            type: 'boolean',
            defaultsTo: true
        },
        user: {
            model: "user"
        },
        histories: {
            collection: "history",
            via: "account"
        }
    }
});