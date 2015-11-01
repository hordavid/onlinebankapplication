var Waterline = require("waterline");

module.exports = Waterline.Collection.extend({
    identity: "history",
    connection: "disk",
    attributes: {
        date : { 
            type: "date",
            defaultsTo: function() { return new Date();}
        },
        sourceaccount: "string",
        targetaccount: "string",
        amount: "integer",
        currency: "string",
        increase: {
            type: "boolean",
            enum: [true, false],
            required: true
        },
        account: {
            model: "account"
        }
    }
});