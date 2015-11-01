var Waterline = require('waterline');
var diskAdapter = require('sails-disk');

module.exports = {
    orm: new Waterline(),
    adapters: {
        disk: diskAdapter
        
    }, 
    connections: {
        disk: {
            adapter: 'disk'
            
        }
    },
    defaults: {
        migrate: 'alter'
        
    }
};