var slug = require('slug-component'),
    moment = require('moment'),
    extend = require('gextend'),
    _ = require('underscore');

var DEFAULTS = {
    featuredItems: 3
}

function appendMetadata(config) {

    config = extend({}, DEFAULTS, config);

    return function (files, lbr, done) {
        var metadata = lbr.metadata();

        //TODO: Consolidate how we gather tags!
        //redo simple array, and metadata.collections.tags
        var tags = [];
        metadata.tags = {};

        function append(collectionItem, urlPrefix) {
            //TODO: slug options, how to handle special chars.
            var slugVal = slug(collectionItem.title);
            var datePart = moment(collectionItem.date).utc().format(config.datePattern);

            collectionItem.url = urlPrefix + datePart + '/' + slugVal;

            _.each(collectionItem.tags, function (iTag) {
                tags.push(iTag);

                if(!metadata.tags.hasOwnProperty(iTag)){
                    metadata.tags[iTag] = {
                        label: iTag,
                        posts:[]
                    };
                }

                metadata.tags[iTag].posts.push(collectionItem);
            });
            //BUG: Without this, items without tags shows the
            //tags metadata object. We have to clean this whole
            //thing up!!!
            if(!collectionItem.tags) collectionItem.tags = [];
        }

        function featuredItemsForSection(sectionId, total, metadata){
            var index = 0,
                section = metadata[sectionId],
                sectionUrl = '/' + sectionId + '/';

            section.pinned = [];
            section.forEach(function (_post) {
                append(_post, sectionUrl);

                if (index < total) {
                    ++index;
                    section.pinned.push(_post);
                }
            });
        }

        featuredItemsForSection('blog', config.featuredItems, metadata);
        // var index = 0;

        // metadata.blog.pinned = [];
        // metadata.blog.forEach(function (_post) {
        //     append(_post, '/blog/');

        //     if (index < config.featuredItems) {
        //         ++index;
        //         metadata.blog.pinned.push(_post);
        //     }
        // });

        featuredItemsForSection('projects', config.featuredItems, metadata);
        // index = 0;
        // metadata.projects.pinned = [];
        // metadata.projects.forEach(function (_post) {
        //     append(_post, '/projects/');

        //     if (index < config.featuredItems) {
        //         ++index;
        //         metadata.projects.pinned.push(_post);
        //     }
        // });

        metadata.collections.tags = _.uniq(tags);

        done();
    };
}

module.exports = appendMetadata;