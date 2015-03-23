var extname = require('path').extname;
var dirname = require('path').dirname;
var basename = require('path').basename;

//requirements!
var front = require('front-matter');
var gextend = require('gextend');
// var debug = require('debug')('librarian-frontmatter');

var DEFAULTS = {
    extension: '.yaml',
    replace: false
};

function plugin(options){

    options = options || DEFAULTS;

    return function(files, lbr, done){
        setImmediate(done);

        Object.keys(files).forEach(function(filename){
            if(!yaml(filename)) return

            var data = files[filename];
            var dir = dirname(filename);
            var file = basename(filename, extname(filename)) + options.extension;

            if(dir !== '.') file = dir + '/' + file;

            // debug('converting from toto to front matter: %s', filename);

            var parsed = front(data.contents.toString());

            var out = gextend({}, parsed.attributes);

            //TODO: We should be able to do this dynamically
            out.mode = data.mode;
            out.stats = data.stats;
            out.isUtf8 = data.isUtf8;
            out.contents = new Buffer(parsed.body);

            //Keep track of original attributes from file
            out.__originalAttributes__ = Object.keys(parsed.attributes);

            delete files[filename];
            files[file] = out;
        });
    };
}


function yaml(filename){
    return /\.yaml|\.yml/.test(extname(filename));
}

module.exports = plugin;