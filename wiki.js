var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wiki');

var Page = mongoose.model('Page', {
  _id: String,
  content: String
});

Page.findById('HomePage')
  .them(function(page) {
    page.content = 'Welcome to my grand wiki!';
    return page.save();
  })
  .then(function(page){
      console.log('Success!');
  })
  .catch(function(err){
    console.error(err.message);
  });
