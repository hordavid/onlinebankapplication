var app = require("./app");
var hbs = require('hbs');
var config = require(__dirname + "/config/config");
var waterlineConfig = require(__dirname + '/config/waterline');

hbs.registerPartials(__dirname + '/views/partials');

var orm = waterlineConfig.orm;
orm.loadCollection(require(__dirname + "/models/user"));
orm.loadCollection(require(__dirname + "/models/account"));
orm.loadCollection(require(__dirname + "/models/history"));

orm.initialize(waterlineConfig, function(err, models) { 
    if(err) throw err;
    app.models = models.collections;
    
    app.listen(config.port, function () {
        console.log("Server start on port " + config.port);   
    });
});