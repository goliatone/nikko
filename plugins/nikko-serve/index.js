#!/usr/bin/env node

var instant = require('instant'),
    connect = require('connect'),
    open = require('open'),
    linger = require('linger'),
    path = require('path'),
    Gaze = require('gaze').Gaze,
    serveIndex = require('serve-index');

var app = connect();
var live;
var current;

//Store current url so we can force live reload
app.use(function(req, res, next){
    current = (req.headers['referer'] || '');
    next();
});

module.exports = function serve(options){
    console.log('SERVING', options.port);
    console.log('watch', options.watch);
    console.log('directory', options.directory);
    console.log('open', options.open);

    if(options.watch){
        var watchPath = path.join(options.watch, '/**/*');
        console.log('watching', watchPath);
        var gaze = new Gaze(watchPath);
        // Files have all started watching
        gaze.on('ready', function(watcher) { });

        // A file has been added/changed/deleted has occurred
        gaze.on('all', function(event, filepath) {
            var cmd = options.exec;
            console.log('WE SHOULD TRIGGER BUILD', cmd);
            var exec = require('child_process').exec;
            exec(cmd);
        });
    }

    live = instant(options.directory/*{
        // delay: 200,
        root: options.directory
    }*/);

    app.use(live)
        .use(serveIndex(options.directory, { icons: true, hidden: true }))
        .listen(options.port, function() {
            current = '/';
            var listening = this.address().port;
            if(options.open) open('http://localhost:' + listening);
        });
};

function force(){
    console.log('FORCE RELOAD', current);
    setTimeout(function(){
        live.reload(current);
    },0);
}

var flic = require('flic');
var Bridge = flic.bridge;
var Node = flic.node;

var bridge = new Bridge();
var nikko = new Node('nikko', function(err){
    if(err) return handleError(err);
    // Successfully connected to Bridge
    console.log('niko interprocess communication online');
});

nikko.on('build', function(param1, callback){
    // force();
    // do awesomeness
    console.log(param1); // -> 'flic_is_easy'
    //send a callback fig.1
    callback(null, 'nikko-serve');
});

function handleError(err){
    console.log('BUSYBODY ERROR:', err);
}
