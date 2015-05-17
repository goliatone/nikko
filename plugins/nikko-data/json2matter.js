var globby = require('globby');
var matter = require('gray-matter');
var fs = require('fs');
var resolve = require('path').resolve;
var join = require('path').join;
var basename = require('path').basename;

var config = {
    filepath: getFilePath('out.json', process.cwd()),
    rootpath: getFilePath('gen', process.cwd())
};

module.exports = function json2matter(options){
    var filepath = options.filepath || './out.json';
    var rootpath = options.rootpath || './gen';

    fs.readFile(filepath, 'utf-8', function(err, file){
        var json = JSON.parse(file);
        json.forEach(function(item){
            var data = getData(item);
            var contents = matter.stringify(item.content, data);
            var path = getFilePath(item.path, rootpath);
            fs.writeFileSync(path, contents);
        });
    });
};


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