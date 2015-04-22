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

    var pkgs = config.packages;
    console.log();
    if (config.force) console.log('  force: install');
    pkgs.forEach(function(pkg){
      console.log('  install : %s', pkg);
    });
    console.log();
    console.log(nikko.basePath)

    var pkg = pkgs[0];


    function doInstall(pkg){
        //move node_modules/{pkg}/bin/nikko-{pkg} to nikko.basePath + '/bin'
        var bin = path.resolve(path.join(nikko.basePath, 'node_modules', pkg, 'bin', pkg));
        var binTarget = path.join(nikko.binPath, pkg);

        //move node_modules/{pkg} to nikko.basePath + '/lib/'
        var plug = path.resolve(path.join(nikko.basePath, 'node_modules', pkg));
        var plugTarget = path.join(nikko.pluginPath, pkg);

        console.log('MOVE BIN ', bin, ' to ', binTarget);
        console.log('MOVE PLUGIN ', plug, ' TO ', plugTarget);

        //TODO: we need to chmod 775 out new bin file
        //TODO: if we are installing a plugin, we also need to
        //register ourselves to commander... we should use a dynamic way?
        //=> add plugin to nikko package.plugins id:{'list', 'List plugin'}
        //=> nikko loads pkg, load plugins from there
        fx.move(bin, binTarget, function (err) {
            if (err) return console.error(err);
            console.log("success!");
            fx.move(plug, plugTarget, function (err) {
                if (err) return console.error(err);
                console.log("success!");
            });
        });

    }

    doInstall('nikko-list');

    return

    var options = {
        name: pkg,
        path: nikko.basePath,
        npmLoad: {
            loglevel: 'silent'
        }
    };

    npmi(options, function (err, result) {
        if (err) {
            if      (err.code === npmi.LOAD_ERR)    console.log('npm load error');
            else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
            return console.log(err.message);
        }

        // installed
        var pluginPath = path.resolve(options.path);
        console.log(options.name+'@'+options.version+' installed successfully in '+ pluginPath);

    });
};