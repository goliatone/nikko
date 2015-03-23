var extname = require('path').extname;
var dirname = require('path').dirname;
var basename = require('path').basename;

// var debug = require('debug')('librarian-frontoto');

var DEFAULTS = {
    extension:'.yaml'
};

// var seperators = [ '---', '= yaml =']
// var optionalByteOrderMark = '\\ufeff?'
// var pattern = '^('
//       + optionalByteOrderMark
//       + '((= yaml =)|(---))'
//       + '$([\\s\\S]*?)'
//       + '\\2'
//       + '$'
//       + (process.platform === 'win32' ? '\\r?' : '')
//       + '(?:\\n)?)'
// var regex = new RegExp(pattern, 'm')

function plugin(options){

    options = options || DEFAULTS;

    return function(files, lbr, done){
        setImmediate(done);

        Object.keys(files).forEach(function(filename){
            if(!txt(filename)) return

            var data = files[filename];
            var dir = dirname(filename);
            var outputName = basename(filename, extname(filename)) + options.extension;

            if(dir !== '.') outputName = dir + '/' + outputName;

            // debug('converting from toto to front matter: %s', filename);

            var str = data.contents.toString();

            var format = str.match(/^---([\s\S]*?)/g) || [];

            if(format.length === 2){
                data.contents = new Buffer(str);
                delete files[filename];
                files[outputName] = data;
                return;
            }

            if(format.length === 1) str = str.replace(/^---([\s\S]*?)/, '');

            str = '---\n' + str.replace(/^---([\s\S]*?)/, '').replace(/\n\n/m, '\n---\n');
            data.contents = new Buffer(str);

            delete files[filename];
            files[outputName] = data;
        });
    };
}


function txt(filename){
    return /\.txt/.test(extname(filename));
}

module.exports = plugin;