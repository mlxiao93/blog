var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'public'), function(err) {
  if (err) return console.log(err);
  console.log('publish success');
});
