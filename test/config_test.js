'use strict';

var assert = require('chai').assert;
var sinon = require("sinon");
var fs = require('fs');
var path = require('path');
var Mode = require('stat-mode');
var rm = require('rimraf').sync;
var equal = require('assert-dir-equal');
var exec = require('child_process').exec;
var fixture = path.resolve.bind(path, __dirname, 'fixtures');

var Config = require('../lib/utils/config');

sinon.assert.expose(assert, { prefix: "" });

describe('Config', function(){

    describe('constructor', function(){
        it('should provide a DEFAULTS object', function(){
            assert.isObject(Config.DEFAULTS);
        });

        it('should initialize config with DEFAULTS values', function(){
            var config = new Config();
            Object.keys(Config.DEFAULTS).map(function(prop){
                assert.ok(config[prop] == Config.DEFAULTS[prop]);
            });
        });

        it('should create a filename getter', function(){
            var config = new Config();
            assert.ok(config.filename);
        });

        it('should define a filename setter', function(){
            var config = new Config;
            config.filename = '.peperonerc';
            assert.ok(config.baseName, 'peperone');
        });

        it('should create a "configLoader" method', function(){
            var config = new Config
            assert.isFunction(config.configLoader);
        });
    });

    describe('load', function(){
        it('should create a "config" object', function(){
            var expected = {a:1, b:2, c:3};
            var config = new Config({
                configLoader: function(){
                    return expected;
                }
            });
            config.load();
            assert.equal(config.config, expected);
        });

        xit('should set "baseName" if provided', function(){
            var config = new Config({
                configLoader: function(){ return {}; }
            });
            var expected = 'myBaseName';
            config.load(expected);
            assert.equal(config.baseName, expected);
        });
    });

    describe('save', function(){
        it('should no "target" parameter set it should write to "defaultTarget"', function(){
            var expected = 'myDefaultTarget';
            var config = new Config({
                defaultTarget: expected,
                write: function(target){
                    assert.ok(target, expected);
                }
            });
            config.save({}, expected);
        });

        it('should merge provided "conf" parameter with existing "config" prop', function(){
            var conf = {b: 2, c: 3};
            var expected = {a: 1, b: 2, c: 3};
            var config = new Config({
                config: {a: 1},
                write: function(target){}
            });
            config.save(conf);
            assert.ok(config.config, expected);
        });

        it('should work without arguments', function(){
            var expected = {a: 1, b: 2, c: 3};
            var config = new Config({
                config: expected,
                write: function(target){}
            });
            config.save();
            assert.ok(config.config, expected);
        });
    });

    describe('write', function(){
        it('should exclude "deleteOnWrite" properties from config output', function(){
            var expected = {a: 1};
            var config = new Config({
                config: {a: 1, b: 2, c: 3},
                deleteOnWrite: ['b', 'c'],
                writeFile: function(_, output){
                    assert.ok(output, expected);
                }
            });
            config.write();
        });

        it('should call "configStringify" with config object', function(){
            var expected = {a: 1, b: 2, c: 3};
            var config = new Config({
                config: expected,
                configStringify: function(output){
                    assert.ok(output, expected);
                }
            });
            config.write();
        });

        xit('should generate expected file format', function(){
            var expected = {a: 1, b: 2, c: 3};
            var config = new Config({
                config: expected,
                configStringify: function(output){
                    assert.ok(output, expected);
                }
            });
            config.write();
        });
    });

    describe('getOutputPath', function(){
        it('should return a default path', function(){
            var config = new Config();
            var expected = path.join(config.defaultTarget, config.filename);
            assert.ok(config.getOutputPath(), expected);
        });
        it('should use getOutputPath to determine where to write', function(){
            var config = new Config();
            var spy = sinon.spy(config, 'getOutputPath');
            config.write('target');
            assert.calledOnce(spy);
        });
    });
});