var path = require('path');
var fs = require('fs-extra');
var isEmpty = require('empty-dir');
var chalk = require('chalk');
var exists = require('../../lib/utils/exists').sync;

module.exports = function action(options){

    console.log('Creating a new blog');
    console.log('- Target directory: ', options.target);
    console.log('- Template: ', options.blueprint);
    console.log('- Name: ', options.name);
    console.log('- force: ', options.force);

    var target = path.join(options.target, options.name);
    var blueprint = options.blueprint;
    prepare(target, options);
    move(target, blueprint, options);
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

function move(target, blueprintName, options){
    var blueprint = path.resolve(path.join(__dirname, 'templates', blueprintName));

    if(!exists(blueprint)) {
        var msg = 'The blueprint ## was not found'.replace('##', target);
        console.error(chalk.red('\nnikko create') + chalk.gray(': ') + msg);
        process.exit(1);
    }

    fs.copySync(blueprint, target);
}