var path = require('path');
var flic = require('flic');
var Node = flic.node;

var nikkoBuild = new Node(function(err){
  if(err) return handleError(err);
    console.log('somenode online!');
});


module.exports = function(options){
    console.log('BUILD! ', options);

    var exec = require('child_process').exec;
    var cmd = 'cd ' + options.source + ' && lbr';

    console.log(cmd);

    var child = exec(cmd, onDone);

    function onDone(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }

        /*nikkoBuild.tell('nikko:build', 'flic_is_easy', function(err, response){
            if(err) return handleError(err);
            console.log(response); // -> 'ilovenodejs'
            // process.exit(0);
        });*/
    }
};

function handleError(err){
    console.log('NODE ERROR', err);
}