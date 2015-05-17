


module.exports = function data(options, nikko){
    console.log('DATA', options);
    //Matter 2 JSON
    //patterns
    //input dir
    //json output
    var module = './matter2json';

    //JSON 2 Matter
    //json input
    //output dir
    module = './json2matter';

    var execute = require(module);
    execute(options);
};