'use strict'

var check = require('./helpers/extract-comment.js');

/**
 * A Metalsmith plugin to define values in the metadata.
 * @param {Object} options - the key/value couples to configure the Styleguide
 * @return {Function} - the Metalsmith plugin
 */

module.exports = styleguide;

function styleguide (options) {
  return function (files, metalsmith, done) {
    var pieces;
    for (var f in files) {
        pieces = /(?:\/\*doc)(\r|\n)([\s\S]*?)(?=\*\/)/gm.exec(files[f].contents);
        if(pieces) {
            files[f].contents = pieces[2]; 
        } else {
            delete files[f];
        }
    }
    return done();
  }
}