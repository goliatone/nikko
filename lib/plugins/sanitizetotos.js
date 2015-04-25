var _lbr = require('lbr');
var each = require('metalsmith-each');

var frontoto = require('./plugins/frontoto');
var frontmatter = require('./plugins/frontmatter');

_lbr(__dirname)
    .source('./toto')
    .destination('_lbr')
    .use(each(function(file, filename){
        return filename.toLowerCase();
    }))
    .use(frontoto({
        extension:'.yaml'
    }))
    .use(frontmatter())
    .use(each(function(file, filename){
        if (file.date && file.date.match(/(\d{2})\/(\d{2})\/(\d{4})/)){
            file.date = file.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");

        } else if (filename.match(/(^\d{4})-(\d{2})-(\d{2})/)) {
            var d = filename.match(/(^\d{4})-(\d{2})-(\d{2})/);
            d.shift();
            file.date = d.join('-');
        }
    }))
    .use(each(function(file, filename){
        return filename.replace('.yaml', '.md');
    }))
    .use(each(function(file, filename){
        var parser = require('json2yaml');
        var out = {};

        file.__originalAttributes__.forEach(function(prop){
            out[prop] = file[prop];
        });

        var meta = [];
        var parsed = parser.stringify(out);
        var lines = parsed.split('\n');
        lines.forEach(function(line){
            //yaml outputs two spaces that break front-matter.
            var clean = line.trimLeft();
            //yaml outputted our date as a string, move back to object.
            if(clean.match(/date:/)) clean = clean.replace(/"/g, '');
            meta.push(clean);
        });
        parsed = meta.join('\n');
        file.contents = parsed + '---\n' + file.contents.toString();
    }))
    .build(function(err){
        if(err) throw err;
    });