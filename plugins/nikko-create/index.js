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

    //assert paths!
    //assert.isString(options.target)
    //assert.isString(options.blueprint)

    var target = path.join(options.target, options.name);
    var blueprint = options.blueprint;

    prepare(target, options);
    move(target, blueprint, options);
    install(target);
}


function prepare(target, options){

    if(exists(target)){
        if(!isEmpty.sync(target) && !options.force){
            var msg = 'The target directory ## is not empty'.replace('##', target);
            console.error(chalk.red('\nnikko create') + chalk.gray(': ') + msg);
            console.log(chalk.green('nnikko create')+ chalk.gray(': use "-f" to force'));
            process.exit(1);
        }
        console.log('Remove target dir', target);
        fs.removeSync(target);
    }

    fs.mkdirsSync(target);
}

function move(target, blueprintName, options){
    var blueprint = path.resolve(path.join(__dirname, 'blueprints', blueprintName));

    if(!exists(blueprint)) {
        var msg = 'The blueprint "##" was not found'.replace('##', blueprintName);
        console.error(chalk.red('\nnikko create') + chalk.gray(': ' + msg) + '\n' + blueprint);
        process.exit(1);
    }

    fs.copySync(blueprint, target);
}

function install(target){
    var exec = require('child_process').exec;
    exec('npm i', {cwd: target}, function(err, stdout, stderr){
        console.log('DONE');
    });
}