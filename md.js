/*
Rewrite this code is promise-based style.
Hint: replace the fs module with fs-promise
*/

var fs = require('fs');
var marked = require('marked');
fs.readFile('README.md', function(err, buffer) {
  if (err) {
    console.error(err.message);
    return;
  }
  var contents = buffer.toString();
  var html = marked(contents);
  fs.writeFile('README.html', html, function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Wrote README.html');
  });
});
