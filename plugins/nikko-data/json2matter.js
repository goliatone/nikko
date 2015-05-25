var fs = require('fs');
var globby = require('globby');
var matter = require('gray-matter');

var join = require('path').join;
var resolve = require('path').resolve;
var basename = require('path').basename;
var expand = require('expand-tilde');

var extend = require('gextend');

var DEFAULTS = {
    filepath: getFilePath('out.json', process.cwd()),
    rootpath: getFilePath('gen', process.cwd())
};

//nikko data json -p *.md -o jj.json -s /Users/goliatone/Development/NODEJS/goliatone.com/src/_posts/
module.exports = function json2matter(options, nikko){
    options = extend({}, DEFAULTS, options);

    console.log(options)
    var filepath = options.filepath;
    var rootpath = options.rootpath;

    filepath = resolve(filepath);
    rootpath = resolve(rootpath);

    fs.readFile(filepath, 'utf-8', function(err, file){
        if(err){
            //TODO: What do we do with errors?!
            if(err) return nikko.onError(err);
        }

        var json = JSON.parse(file);
        json.forEach(function(item){
            var data = getData(item);
            var contents = matter.stringify(item.content, data);
            var path = getFilePath(item.path, rootpath);
            fs.writeFileSync(path, contents);
        });
    });
};

function normalize(filepath){
    filepath = resolve(filepath);
    filepath = expand(filepath);
    return filepath;
}

function getFilePath(filepath, append){
    return join(resolve(append), basename(filepath));
}

function getData(item){
    var data = {};
    Object.keys(item).map(function(key){
        if(['@id@', '@content@', '@path@'].indexOf('@'+key+'@') !== -1) return;
        data[key] = item[key];
    });

    return data;
}