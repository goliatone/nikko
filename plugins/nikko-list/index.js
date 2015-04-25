var EventEmitter = require('events').EventEmitter;


module.exports = function(options, nikko){
    var config = nikko.getConfig();

    // console.log('WE ARE LISTING STUFF', config);

    var method = getMethodName(options.item);


    var emitter = module[method](config, nikko);

    emitter.on('done', function(output){
        console.log(output);
    });

    // process.stdout.write(output);

};

module.listPosts = listPosts;
module.listBlueprints = listBlueprints;
module.listPlugins = listPlugins;
module.listSites = listSites;

function getMethodName(item){
    return 'list' + _capitalize(item);
}

function _capitalize(str){
    str = str || '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function listPosts(options){
    //This should be provided by [new] config.
    //TODO: check we actually have a path!!!
    var emitter = new EventEmitter();
    var target = options.new.output;
    var globby = require('globby');
    globby(['*'], {cwd: target, dot: false, nodir: true}, function (err, files) {
        if (err) throw err;
        emitter.emit('done', files);
    });

    return emitter;
}

function listBlueprints(options, nikko){
    var path = require('path');
    var emitter = new EventEmitter();
    var target = path.join(nikko.pluginPath, 'nikko-create', 'blueprints');
    var globby = require('globby');
    globby(['*'], {cwd: target, dot: false, nodir: false}, function (err, files) {
        if (err) throw err;
        emitter.emit('done', files);
    });

    return emitter;
}

function listPlugins(options, nikko){
    var emitter = new EventEmitter();
    var target = nikko.binPath;
    var globby = require('globby');
    globby(['*', '!nikko'], {cwd: target, dot: false, nodir: true}, function(err, files){
        if (err) throw err;

        files.map(function(file){
            return file.replace('nikko-', '');
        });
        emitter.emit('done', files);
    });

    return emitter;
}

function listSites(){
    return 'all sites';
}