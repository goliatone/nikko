'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var fs = require('fs');
var path = require('path');
var Mode = require('stat-mode');
var rm = require('rimraf').sync;
var equal = require('assert-dir-equal');
var exec = require('child_process').exec;
var fixture = path.resolve.bind(path, __dirname, 'fixtures');
var ini = require('ini');

var Plugin = require('../lib/utils/plugin');

Plugin.DEFAULTS.baseName = 'config_test';

sinon.assert.expose(assert, { prefix: "" });

describe('Plugin', function(){

    describe('constructor', function(){
        it('should provide a DEFAULTS object', function(){
            assert.isObject(Plugin.DEFAULTS);
        });

        it('should register itself on the provided store', function(){
            var pkg = {
                name: 'nikko-test',
                description: 'Testing plugin'
            };

            var expected = [{
                'nikko-test':['test', 'Testing plugin']
            }];

            var plugin = new Plugin({
                getPackage:function(){
                    return pkg;
                }
            });

            var store = [];

            plugin.register(store);

            assert.ok(store, expected);
        });

        it('should return a valid package path based on id', function(){

        });

        it('should return an object if provided with a filepath to a json file', function(){
            var plugin = new Plugin({id: 'testing'});
            var filepath = fixture('plugin', 'getPackage.json');
            var expected = require(filepath);
            var result = plugin.getPackage(filepath);
            assert.ok(expected, result);
        });
    });


});