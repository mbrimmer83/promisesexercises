var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-as-promised');
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
  bcrypt.hash(info.password, 10)
    .then(function(encryptedPassword) {
      return User.create({
        _id: info.username,
        encryptedPassword: encryptedPassword
      });
    })
    .then(function(){
      console.log("Success");
    })
    .catch(function(err){
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
    response.send('no errors');
  });


app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
