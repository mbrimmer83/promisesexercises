var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wiki');

var Page = mongoose.model('Page', {
  _id: String,
  content: String
});

Page.findById('HomePage', function(err, page) {
  if (err) {
    console.error(err.message);
    return;
  }
  page.content = 'Welcome to my grand wiki!';
  page.save(function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Success!');
  });
});
