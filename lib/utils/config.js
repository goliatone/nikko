
var fs = require('fs');
var ini = require('ini');
var rc = require('rc');
var extend = require('gextend');
var path =require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//We need CRUD
//We need interpolation

var DEFAULTS = {
    autoinitialize: true,

    baseName: 'nikko',
    defaultTarget: process.env.PWD,
    deleteOnWrite: ['config', 'configs'],

    configLoader: function(args){
        return rc.apply(null, args);
    },
    configStringify: function(config){
        return ini.stringify(config);
    },
    writeFile: function(filepath, output){
        try {
            fs.writeFileSync(filepath, output);
        } catch(e) {
            //TODO: do something sensible here
        }
    }
};

function Config(config){
    EventEmitter.call(this);
    config = extend({}, DEFAULTS, config);
    if(config.autoinitialize) this.init(config);
}

util.inherits(Config, EventEmitter);
Config.DEFAULTS = DEFAULTS;

Config.prototype.init = function(config){
    if(this.initialized) return
    this.initialized = true;

    extend(this, DEFAULTS, config);

    Object.defineProperty(this, 'filename', {
        get: function() { return '.' + this.baseName + 'rc'; },
        set: function(filename){
            //TODO: It should start with dot and finish with rc?
            this.baseName = filename.replace(/^\.$/, '').replace(/rc$/,'');
        }
    });
};

Config.prototype.load = function(baseName, defaults) {
    //TODO: We already have baseName, we should pop it
    //we should also merge defaults with existing config?
    var args = Array.prototype.slice.call(arguments);
    this.config = this.configLoader(args);
    return this;
};

Config.prototype.save = function(conf, writeTo){

    this.config = extend({}, this.config, conf);

    this.write(writeTo);

    return this;
};

Config.prototype.write = function(writeTo){

    var config = extend({}, this.config);

    this.deleteOnWrite.map(function(prop){
        delete config[prop];
    });

    var output = this.configStringify(config);
    var filepath = this.getOutputPath(writeTo);

    this.writeFile(filepath, output);

    return this;
};

Config.prototype.getOutputPath = function(writeTo){
    if(typeof writeTo !== 'string'){
        writeTo = undefined;
        // this.logger.warn('getOutputPath called with non string, using defaultTarget');
    }
    writeTo = writeTo || this.defaultTarget;
    return path.resolve(path.join(writeTo, this.filename));
};

Config.prototype.logger = console;

module.exports = Config;