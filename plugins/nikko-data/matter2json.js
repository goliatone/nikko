var globby = require('globby');
var matter = require('gray-matter');

var join = require('path').join;
var resolve = require('path').resolve;
var expand = require('expand-tilde');

var assertis = require('assert-is');
var extend = require('gextend');

var hasher = getHaser();

var DEFAULTS = {
    patterns: ['*.md'],
    source: process.cwd(),
    output: join(process.cwd(), 'matter.json')
};

//nikko data matter -r ./gen -t ./jj.json
module.exports = function matter2Json(options, nikko){
    options = extend({}, DEFAULTS, options);

    //TODO: We might actually want to save the relative path
    //to the project, so that we can move the same config
    //around
    options.source = normalize(options.source);
    options.output = normalize(options.output);

    var out =[];

    var done = function(err){
        if(err) return nikko.onError(err);
    };

    globby( options.patterns, {
        cwd: options.source
    }, function(err, paths){
        console.log(paths);
        paths.map(function(file){
            var model = {};

            var f = matter.read(join(options.source, file));

            hasher.hash(f.path);

            model.id = hasher.getValue();
            model.content = f.content;
            model.path = f.path;

            Object.keys(f.data).map(function(key){
                model[key] = f.data[key];
            });

            out.push(model);

            hasher.clear();
        });

        var fs = require('fs');
        fs.writeFile(options.output, JSON.stringify(out, null, 4), done);
    });
};

function normalize(filepath){
    filepath = resolve(filepath);
    filepath = expand(filepath);
    return filepath;
}

function getHaser(){
    //TODO: Think hasher strategy
    var Hash = require('hash-anything').Hash;
    var XXHash = require('xxhash');

    var doHash = function(buf) {
        var hasher = new XXHash(0x6a4e9e36); //random seed
        hasher.update(buf);
        return hasher.digest();
    };

    var hasher = new Hash(doHash);

    return hasher;
}