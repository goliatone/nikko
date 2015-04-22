var path = require('path');
var fs = require('fs-extra');
var isEmpty = require('empty-dir');
var chalk = require('chalk');
var exists = require('../utils/exists').sync;

module.exports = function action(options){

    console.log('Creating a new blog');
    console.log('- Target directory: ', options.directory);
    console.log('- Template: ', options.template);
    console.log('- Name: ', options.name);
    console.log('- force: ', options.force);

    var target = path.join(options.directory, options.name);
    var template = options.template;
    prepare(target, options);
    move(target, template, options);
}


function prepare(target, options){

    if(exists(target)){
        if(!isEmpty.sync(target) && !options.force){
            var msg = 'The target directory ## is not empty'.replace('##', target);
            console.error(chalk.red('\nnikko create') + chalk.gray(': ') + msg);
            process.exit(1);
        }
        console.log('Remove target dir', target)
        fs.removeSync(target);
    }

    fs.mkdirsSync(target);
}

function move(target, templateName, options){
    var template = path.resolve(path.join(__dirname, 'templates', templateName));

    if(!exists(template)) {
        var msg = 'The template ## was not found'.replace('##', target);
        console.error(chalk.red('\nnikko create') + chalk.gray(': ') + msg);
        process.exit(1);
    }

    fs.copySync(template, target);
}