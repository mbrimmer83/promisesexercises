var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/coffee-store');

var User = mongoose.model('User', {
  _id: String,
  encryptedPassword: String
});

var app = express();
app.use(bodyParser.json());

function formatMongooseError(err) {
  var message = err.message + '. ';
  if (err.errors) {
    message +=
      Object.keys(err.errors).map(function(key) {
        return err.errors[key].message
      }).join(' ');
  }
  return message;
}

app.post('/register', function(request, response) {
  var info = request.body;

  // 1. Use bcrypt to encrypt the user's password
  bcrypt.hash(info.password, 10, function(err, encryptedPassword) {
    // 2. Return error response if bcrypt failed
    if (err) {
      response.json({
        status: 'fail',
        error: err.message
      });
      return;
    }
    // 3. Create a user in the DB
    User.create({
      _id: info.username,
      encryptedPassword: encryptedPassword
    }, function(err) {
      // 4. Return error response if created failed
      if (err) {
        var message = formatMongooseError(err);
        response.json({ status: 'fail', error: message });
      } else {
        // 5. Return ok response
        response.json({
          status: 'ok'
        });
      }
    });
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
