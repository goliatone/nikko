
var fs = require('fs');
var ini = require('ini');
var rc = require('rc');
var extend = require('gextend');
var path =require('path');


//We need CRUD
//We need interpolation

var DEFAULTS = {
    filename: '.nikkorc',
    defaultTarget: process.env.PWD
};

function Config(){
    this.filename = '.nikkorc';
    this.defaultTarget = process.env.PWD;
}

Config.prototype.load = function() {
    var args = Array.prototype.slice.call(arguments);
    this.config = rc.apply(null, args);
    return this;
};

Config.prototype.save = function(conf, target){
    target = target || this.defaultTarget;
    this.config = extend({}, this.config, conf);
    this.write(target);
};

Config.prototype.write = function(target){
    var config = extend({}, this.config);
    delete config.config;
    delete config.configs;

    var filepath = path.resolve(path.join(target, this.filename));
    var output = ini.stringify(config);
    fs.writeFileSync(filepath, output);

    return this;
};

module.exports = Config;