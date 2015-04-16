#!/usr/bin/env node

var instant = require('instant'),
    connect = require('connect'),
    linger = require('linger'),
    open = require('open'),
    serveIndex = require('serve-index');

var app = connect();


module.exports = function serve(options){
    console.log('SERVING', options.port);
    console.log('watch', options.watch);
    console.log('directory', options.directory);

    app.use(instant(options.directory))
        .use(serveIndex(options.directory, { icons: true, hidden: true }))
        .listen(options.port, function() {
            var listening = this.address().port;
            if(options.open) open('http://localhost:' + listening);
            linger('listening on port ' + listening + ' and waiting for changes');
        });
};