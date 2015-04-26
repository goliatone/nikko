/*
 * nikko
 * https://github.com/goliatone/nikko
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

'use strict';

var Config = require('./utils/config');
var Plugin = require('./utils/plugin');

var path = require('path');
var util = require('util');
var extend = require('gextend');
var assert = require('assert-is');
var EventEmitter = require('events').EventEmitter;

var DEFAULTS = {
    autoinitialize: true,
    PACKAGE_NAME: 'package.json'
};

function Nikko(config){
    EventEmitter.call(this);
    config = extend({}, DEFAULTS, config);
    if(config.autoinitialize) this.init(config);
}

util.inherits(Nikko, EventEmitter);
Nikko.DEFAULTS = DEFAULTS;
/*
 * Unit testing stuff and such.
 */
Nikko.packagePath = '../package.json';
Nikko.packageObject = require(Nikko.packagePath);

Nikko.prototype.init = function(config){
    if(this.initialized) return
    this.initialized = true;

    this.basePath = path.resolve(path.join(__dirname, '..'));
    console.log('BASE PATH ', this.basePath)
    this.binPath = path.join(this.basePath, 'bin');
    this.pluginPath = path.join(this.basePath, 'plugins');
    this.modulePath = path.join(this.basePath, 'node_modules');

    extend(this, DEFAULTS, config);

    this.buildConfig();
};

Nikko.prototype.buildConfig = function(){
    this.cloader = new Config();
    this.cloader.load('nikko', {});
    this.config = this.cloader.config;
    return this;
};

Nikko.prototype.getConfig = function(namespace){
    //TODO: Do this for realz, keypath etc. GConfig for node?
    if(namespace) return this.config[namespace];
    return this.config;
}

/**
 * Function that registers a plugin, usually
 * called from `install` command.
 * @param  {String} plugin Plugin id
 * @return {this}
 */
Nikko.prototype.registerPlugin = function(pluginId){

    var plugin = new Plugin({
        owner: this,
        id: pluginId,
        basePath: this.pluginPath
    });

    var json = this.getPackage();
    if(!json.plugins) json.plugins = [];

    plugin.register(json.plugins);

    this.savePackage(json);

    //After we have moved the plugin, we should cd to plugin dir and npm i
    this.emit('plugin.registered.' + pluginId, {plugin:pluginId});

    return this;
};

///////////////////////////////
//TODO: Move all package.json stuff to its own module
Nikko.prototype.getPackagePath = function(filepath){
    filepath = filepath || this.basePath;
    return path.join(filepath, this.PACKAGE_NAME);
};

Nikko.prototype.getPackage = function(filepath){
    var json = {};
    var packagepath = this.getPackagePath(filepath);

    try {
        json = require(packagepath);
    } catch(e){
        //do something sensible
    }
    return json;
};

Nikko.prototype.savePackage = function(data){
    var fs = require('fs');
    fs.writeFileSync(this.getPackagePath(), JSON.stringify(data, null, 2));
};
///////////////////////////////


Nikko.prototype.registerProject = function(name){
    console.log('CREATE REGISTRY');
};

///////////
// CONFIG
///////////
///A) When we create a project we check for .nikkorc
/// if its not there we make a new one
Nikko.prototype.createConfigFile = function(){

};

Nikko.extract = function(obj, props){
    var out = {};
    if(!obj || !props) return out;
    props.forEach(function(key){
        if(obj[key] === undefined) return;
        out[key] = obj[key];
    });
    return out;
};
///////////


/**
 * Executes a plugin. It will look for the
 * plugin in the directory containing installed
 * plugins.
 * Command id is the command name that we enter on
 * terminal, which then maps to a file inside `bin`
 * following the convention **nikko-**{command}.
 *
 *
 * @param  {String} command Command id
 * @param  {Object} config  Configuration obj
 * @return {Nikko}          Nikko instance.
 */
Nikko.prototype.execute = function(command, config){
    assert.isString(command, 'Command id should be a string');

    var module = path.join(this.pluginPath, 'nikko-' + command);

    //Extract the config for this command:
    //TODO: move to config manager.
    config = extend({}, this.config[command], config);

    try {
        var plugin = require(module);
        plugin(config, this);
    } catch(e){
        //we should check if we have it installed.
        this.logger.error('Error executing command '+ module + '\n\n' + e.message);
    }
};

/**
 * Logger facility. By default
 * exposes `console`
 * @type {Function}
 */
Nikko.prototype.logger = console;

/**
 * Execute plugin
 * @param  {String} command Command id
 * @param  {Object} config  Configuration obj
 * @return {Nikko}          Nikko instance.
 */
Nikko.execute = function(command, config){
    var nikko = new Nikko();
    if(!command) {
        nikko.error = ['Command id should be provided'];
        nikko.logger.error('Command id should be provided');
    } else nikko.execute(command, config);
    return nikko;
};


module.exports = Nikko;
