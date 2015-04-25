var fs = require('fs');
var glob = require('glob');
var path = require('path');
var moment = require('moment');
var extend = require('gextend');
var timezone = require('moment-timezone');
var util = require('util');


var DEFAULTS = {
    partials:'partials',
    templates: 'templates',
    extension: '.hbs',
    timeZone: 'America/New_York'
};



var Handlebars = require('handlebars');

function registerHelpers(o){
    Handlebars.registerHelper('shortDate', function(date){
        return moment(date).utc().format('MMM D, YYYY');
    });

    Handlebars.registerHelper('longDate', function(date){
        //TODO: Fix, this does not reflect the right time!!
        return moment(date).utc().format('MMMM Do YYYY, h:mm:ss a');
    });


    Handlebars.registerHelper('stringify', function(context, block){
        return util.inspect(context, { showHidden: true, depth: 2 });
    });

    Handlebars.registerHelper('slice', function(context, block) {
        var ret = "",
            offset = parseInt(block.hash.offset) || 0,
            limit = parseInt(block.hash.limit) || 5,
            i = (offset < context.length) ? offset : 0,
            j = ((limit + offset) < context.length) ? (limit + offset) : context.length;

        for(i,j; i<j; i++) {
            ret += block.fn(context[i]);
        }

        return ret;
    });

    Handlebars.registerHelper('fullUrl', function(url){
        //TODO: Make this for realz!!
        return o.baseUrl + '/' + url;
    });
}

function loadPartials(o){
    return function (err, files) {
        if(err) throw err;

        function loadPartial(filepath){
            return fs.readFileSync(filepath).toString();
        }

        files.forEach(function(filename){
            try {
                var template = loadPartial(filename);
                var partialName = path.basename(filename, o.extension);
                Handlebars.registerPartial(partialName, template);
            } catch(e) {
                throw e;
            }
        });
    };
}

module.exports = function(o){
    o = extend({}, DEFAULTS, o);

    registerHelpers(o);

    moment.tz.setDefault(o.timeZone);

    var partials = path.join(process.env.PWD, o.templates, o.partials, '*' + o.extension);
    glob(partials, loadPartials(o));

    return function(){}
};
