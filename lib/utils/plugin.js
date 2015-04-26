var util = require('util');
var path = require('path');
var extend = require('gextend');
var EventEmitter = require('events').EventEmitter;



var DEFAULTS = {
    autoinitialize: true,
    PACKAGE_NAME: 'package.json'
};

function Plugin(config){

    EventEmitter.call(this);
    config = extend({}, DEFAULTS, config);
    if(config.autoinitialize) this.init(config);
}

util.inherits(Plugin, EventEmitter);
Plugin.DEFAULTS = DEFAULTS;

Plugin.prototype.init = function(config){
    if(this.initialized) return
    this.initialized = true;

    extend(this, DEFAULTS, config);
}


Plugin.prototype.register = function(store){
    var info = {};
    var pkg = this.getPackage();

    info.name = pkg.name;

    //TODO: Check to see if we already have the plugin
    //registered.
    //Also keep track of version!
    info.description = [
        info.name.replace('nikko-', ''),
        pkg.description
    ];
    store.push(info);
};

Plugin.prototype.getPackage = function(filepath){

    var json = {};
    var packagepath = this.getPackagePath(filepath);

    try {
        json = require(packagepath);
    } catch(e){
        //do something sensible
    }
    return json;
};

Plugin.prototype.getPackagePath = function(filepath){
    filepath = filepath || this.basePath;
    return path.join(filepath, this.id, this.PACKAGE_NAME);
};


Plugin.prototype.makeModel = function(){
    var model = {
      "name": "go",
      "description": [
        "go",
        "Go to project directory"
      ]
    };

    return model;
}

module.exports = Plugin;

// function JSONFile(){}

// JSONFile.prototype.load = function(path, callback){
//     var out = {};
//     fs.readFile(path, 'utf-8', function(err, data){
//         try {
//             out = JSON.parse(data);
//         } catch(e) {
//             this.emit('error', e);
//             return callback(e, null);
//         }
//         this.emit('data', out);
//         callback(null, out);
//     }.bind(this));
// };

// JSONFile.prototype.save = function(){

// };
//
