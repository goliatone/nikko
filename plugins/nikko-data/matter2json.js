var globby = require('globby');
var matter = require('gray-matter');
var resolve = require('path').resolve;
var join = require('path').join;
var assertis = require('assert-is');

var hasher = getHaser();

var config = {
    patterns: ['*.md'],
    source: process.cwd(),
    output: join(process.cwd(), 'matter.json')
};

module.exports = function matter2Json(options){

    options.patterns = options.patterns || config.patterns;
    //We might actually want to save the relative path
    //to the project, so that we can move the same config
    //around
    options.source = options.source ? resolve(options.source) : config.source;

    options.output = options.output || config.output;

    var out =[];

    var done = function(err){
        if(err) return console.log(err);
        console.log('DONE');
    }

    globby( config.patterns, {
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