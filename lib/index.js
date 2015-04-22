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
    this.pluginPath = path.join(this.basePath, 'lib');
    this.modulePath = path.join(this.basePath, 'node_modules');
};

Nikko.prototype.installPlugin = function(plugin){
    // https://github.com/vesln/package
    // save package plugin
};

Nikko.prototype.execute = function(command, config){
    //TODO: we should do this defensively or like python?
    try {
        var plugin = require('./nikko-' + command);
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
