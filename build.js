var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var extname = require('path').extname;
var collections = require('metalsmith-collections');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var marked = require('marked');
var prism = require('prismjs');

function clearSCSS(){
  return function drafts(files, metalsmith, done){
    for (var file in files) {
        if (extname(file) === '.scss') {
            delete files[file];
        } else {
            if(files[file].category) {
                files[file].collection = files[file].category;
            }
        }
    }
    done();
  };
  
}

var renderer = new marked.Renderer();

// Change the code method to output the same as Prism.js would.
renderer.code = function(code, lang, escaped) {
  var code1 = this.options.highlight(code, lang);

  if (!lang) {
    return '<pre><code>' + code + '\n</code></pre>';
  }

  // e.g. "language-js"
  var langClass = this.options.langPrefix + lang;

  return code + '<br><pre class="' + langClass + '"><code class="' + langClass + '">' +
    code1 +
    '</code></pre>\n';
};

// Translate marked languages to prism.
var extensions = {
  js: 'javascript',
  scss: 'css',
  sass: 'css',
  html: 'html_example',
  svg: 'markup',
  xml: 'markup',
  py: 'python',
  rb: 'ruby',
  ps1: 'powershell',
  psm1: 'powershell'
};

Metalsmith(__dirname)
  .source('./markdown')  
  .destination('./build')
  .use(clearSCSS())
  .use(collections())
  .use(function(files, metalsmith, done) {
   // console.log(files);
    console.log(metalsmith._metadata);
    done();
  })
  .use(markdown({
      gfm: true,
      smartypants: true,
      renderer: renderer,
      langPrefix: 'language-',
      highlight: function(code, lang) {
        if (!prism.languages.hasOwnProperty(lang)) {
          // Default to markup.
          lang = extensions[lang] || 'markup';
        }

        return prism.highlight(code, prism.languages[lang]);
      }
  }))
  .use(permalinks({pattern: ':collection/:name'}))
  .use(layouts({
    engine: 'handlebars',
    default: 'layout.html'
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });

//   .use(layouts({
//     engine: 'handlebars'
//   }))