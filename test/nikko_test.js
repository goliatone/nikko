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

var Nikko = require('../');

sinon.assert.expose(assert, { prefix: "" });

describe('Nikko', function(){

    describe('extract', function(){
        it('should extract array of properties from a given object', function(){
            var obj = { a: 1, b: 2, c: 3 };
            var props = ['a', 'c'];
            assert.ok(Nikko.extract(obj, props), {a:1, c:3});
        });

        it('should handle null objects', function(){
            assert.ok(Nikko.extract(null, ['a', 'c']), {});
        });

        it('should handle null props array', function(){
            var obj = { a: 1, b: 2, c: 3 };
            var props;
            assert.ok(Nikko.extract(obj, props), {});
        });
    });

    describe('execute', function(){
        it('should return an instance of nikko', function(){
            assert.instanceOf(Nikko.execute('nothing', {}), Nikko);
        });

        it('should handle undefined command name', function(){
            assert.ok(Nikko.execute(null, {}));
        });
        xit('should execute a command', function(){});
    });

    describe('nikko', function(){
        afterEach(function(){
            // Nikko.prototype.restore();
        });

        it('should be an event emitter', function(){
            var nikko = new Nikko({autoinitialize:false});
            assert.ok(nikko)
            assert.isFunction(nikko.on);
            assert.isFunction(nikko.emit);
            assert.isFunction(nikko.removeListener);
        });

        it('should have a DEFAULTS class property', function(){
            assert.isObject(Nikko.DEFAULTS);
        });

        it('should autoinitialize should default to true', function(){
            assert.isTrue(Nikko.DEFAULTS.autoinitialize);
        });

        it('should not call init if config.autoinitialize is false', function(){
            var spy = sinon.spy(Nikko.prototype, 'init');
            var nikko = new Nikko({autoinitialize:false});
            assert.notCalled(spy);
            Nikko.prototype.init.restore();
        });

        it('should init by default', function(){
            var spy = sinon.spy(Nikko.prototype, 'init');
            var nikko = new Nikko();
            assert.calledOnce(spy);
            Nikko.prototype.init.restore();
        });

        it.only('should create paths', function(){
            var nikko = Nikko;
            assert.isString(nikko.basePath)
            // ['basePath', 'binPath', 'pluginPath', 'modulePath'].forEach(function(prop){
            //     assert.isString(nikko[prop], prop + ' not defined');
            // });
        });
    });
});