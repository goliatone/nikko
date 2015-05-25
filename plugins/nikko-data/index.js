
var commands = {
    json:'./json2matter',
    matter: './matter2json'
};

module.exports = function data(options, nikko){
    var module = commands[options.command];

    if(!module){
        var msg = 'Data plugin: command '+options.command+' not recognized';
        return nikko.onError(new Error(msg));
    }

    var execute = require(module);

    execute(options, nikko);
};