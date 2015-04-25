var fx = require('fs-extra');
var npmi = require('npmi');
var path = require('path');
/*
 * TODO: It should install 4 things:
 *     - command/plugins
 *     - blueprints for sites (blog, spa)
 *     - generator templates (post, article, page)
 *     - themes <= This requires a whole lot of thought.
 */
module.exports = function install(config, nikko){

    var packages = config.packages;

    packages.forEach(function(packageId){
        console.log('  install : %s', packageId);
        installPackage({
            name: packageId,
            path: nikko.basePath,
            npmLoad: {
                loglevel: 'silent'
            }
        });
    });
};

function doInstall(pluginId){

    var plugSource = path.resolve(path.join(nikko.basePath, 'node_modules', pluginId));
    var plugTarget = path.join(nikko.pluginPath, pluginId);

    var binSource = path.join(plugSource, 'bin', pluginId);
    var binTarget = path.join(nikko.binPath, pluginId);

    fx.move(binSource, binTarget, function (err) {
        if (err){
            if(err.code === 'ENOENT'){
                nikko.logger.error('nikko-install Error: the plugin was not found on the node_modules. Are you sure npm was successful?');
                return
            }
            return console.error(err);
        }

        fx.chmodSync(binTarget, 0755);

        fx.move(plugSource, plugTarget, function (err) {
            if (err) return console.error(err);
            console.log("success!");
            //We should get data from plugin... before we go!
            nikko.registerPlugin(pluginId);
        });
    });
}

function installPackage(options){
    console.log('WARNING! NPM INSTALL DISABLED DEBUGGING ======')
    doInstall(options.name);
    console.log('WARNING! NPM INSTALL DISABLED DEBUGGING ======')
    return

    npmi(options, function (err, result) {
        if (err) {
            if (err.code === npmi.LOAD_ERR) console.log('npm load error');
            else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
            return console.log(err.message);
        }

        // installed
        var pluginPath = path.resolve(options.path);
        console.log(options.name+'@'+options.version+' installed successfully in '+ pluginPath);

        doInstall(options.name);
    });
}