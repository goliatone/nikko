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


Nikko.prototype.init = function(config){
    if(this.initialized) return
    this.initialized = true;

    extend(this, DEFAULTS, config);

    this.basePath = path.resolve(path.join(__dirname, '..'));
    this.binPath = path.join(this.basePath, 'bin');
    this.pluginPath = path.join(this.basePath, 'plugins');
    this.modulePath = path.join(this.basePath, 'node_modules');
};

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
    });
};

Nikko.prototype.execute = function(command, config){
    //TODO: we should do this defensively or like python?
    var module = path.join(this.pluginPath, 'nikko-' + command);
    try {
        var plugin = require(module);
        plugin(config, this);
    } catch(e){
        this.logger.error('Error executing command\n\n'+e.message);
    }
};

Nikko.prototype.logger = console;

Nikko.execute = function(command, config){
    var nikko = new Nikko();
    nikko.execute(command, config);
    return nikko;
};

module.exports = Nikko;
