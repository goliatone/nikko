/*
 * nikko
 * https://github.com/goliatone/nikko
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var extend = require('gextend');

var DEFAULTS = {
    autoinitialize: true
};

function Nikko(config){
    config = extend({}, DEFAULTS, config);
    if(config.autoinitialize) this.init(config);
}

/*
 * Unit testing stuff and such.
 */
Nikko.packagePath = '../package.json';
Nikko.packageObject = require(Nikko.packagePath);

Nikko.prototype.init = function(config){
    if(this.initialized) return
    this.initialized = true;

    extend(this, DEFAULTS, config);

    this.basePath = path.resolve(path.join(__dirname, '..'));
    this.binPath = path.join(this.basePath, 'bin');
    this.pluginPath = path.join(this.basePath, 'plugins');
    this.modulePath = path.join(this.basePath, 'node_modules');

    this.buildConfig();
};

Nikko.prototype.buildConfig = function(){
    var Config = require('./utils/config');
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
Nikko.prototype.registerPlugin = function(plugin){
    // https://github.com/vesln/package
    // save package plugin
    var readJson = require('read-package-json');

    // readJson(filename, [logFunction=noop], [strict=false], cb)
    var pkgPath = path.join(this.basePath, 'package.json');
    console.log('READ PACKAGE', pkgPath);
    readJson(pkgPath, this.logger.error, false, function (er, data) {
      if (er) {
        console.error("There was an error reading the file");
        return
      }
      console.error('the package data is', data);
      if(!data.plugins) data.plugins = [];

      //Plugin should provide a register method? Or should we
      //get this form plugin pakckage? package of plugin should
      //provide name + command + description + exported files which
      //get moved on install
      var plugInfo = {};
      plugInfo[plugin] = ['list', 'List plugin'];
      data.plugins.push(plugInfo);
      var fs = require('fs');
      fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2));

      //After we have moved the plugin, we should cd to plugin dir and npm i
    });

    return this;
};


///////////
// CONFIG
///////////
///A) When we create a project we check for .nikkorc
/// if its not there we make a new one
Nikko.prototype.createConfig = function(){

};

Nikko.extract = function(obj, props){
    var out = {};
    props.forEach(function(key){
        if(props[key] === undefined) return;
        out[key] = props[key];
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
    nikko.execute(command, config);
    return nikko;
};


module.exports = Nikko;
