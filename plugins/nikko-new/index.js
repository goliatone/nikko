var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var Handlebars = require('handlebars');
var exists = require('../../lib/utils/exists').sync;

var questions = require(path.join(__dirname, 'templates', 'post', 'questions'));


module.exports = function nikkoNew(options){
console.log(options)
    if(options.interactive) return makeInteractive(options);

    //TODO: How do we handle errors?
    if(!options.interactive && !options.data){
        console.error('data path required');
        process.exit(1);
    }

    loadData(options);
};


function loadData(options){
    var filepath = path.join(path.resolve(options.data));
    var source = fs.readFileSync(filepath, 'utf8');

    var data;

    try{
        data = JSON.parse(source);
    } catch(e) {
        console.error('malformed json');
        process.exit(1);
    }

    generateFile(options, data);
}

function generateFile(options, data){
    var result = parseTemplate(options.template, data);
    var basename = data.date + '-' + data.slug + '.md';
    // console.log(result);

    try {
        var filepath = path.resolve(options.output);
        filepath = path.join(filepath, basename);

        if(exists(filepath) && !options.force) throw new Error('File ' + filepath + ' already exists');

        fs.writeFileSync(filepath, result);

    } catch(e){
        console.log(e);
        process.exit(1);
    }
}

function makeInteractive(options){
    inquirer.prompt( questions, generateFile.bind(null, options));
}

function parseTemplate(type, data){
    var filepath = path.join(__dirname, 'templates', type, 'template.hbs');
    var source = fs.readFileSync(filepath, 'utf8');
    var template = Handlebars.compile(source);
    return template(data);
}