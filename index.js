var Metalsmith  = require('metalsmith');
// var layouts     = require('metalsmith-layouts');
var copy = require('metalsmith-copy');
// var permalinks  = require('metalsmith-permalinks');


function styleguide() {
  return function(files, metalsmith, done) {
      var pieces;
      for (var f in files) {
          pieces = /(?:\/\*doc)(\r|\n)([\s\S]*?)(?=\*\/)/gm.exec(files[f].contents);
          if(pieces) {
            files[f].contents = pieces[2]; 
          }
     }

    done();
  };
};

Metalsmith(__dirname)
  .source('./sass')
  .destination('./markdown')
  .use(styleguide())  
  .use(copy({
    pattern: '*.scss',
    extension: '.md'
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
  