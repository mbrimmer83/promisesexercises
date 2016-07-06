var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo-db');
var Student = require('./studentsmodel');

Student.findOne({ name: 'Matthew'})
  .then(function(matt) {
    console.log('we found Matthew', matt);
  })
  .catch(function(err) {
    console.error("We didn't find Matthew because", err.message);
  });
