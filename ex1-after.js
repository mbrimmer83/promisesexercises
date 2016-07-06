/*
# After

The promisified version uses the bcrypt-as-promised module:

var bcrypt = require('bcrypt-as-promised');

Mongoose comes with built-in promises.

1. Use bcrypt to encrypt the user's password
2. Create a user in the DB
3. Return ok response
4. One catch-all error handling function for returning an error response
*/

var bcrypt = require('bcrypt-as-promised');

app.post('/register', function(request, response) {
  var info = request.body;

  // 1. Use bcrypt to encrypt the user's password
  bcrypt.hash(info.password, 10)
    .then(function(encryptedPassword) {
      // 2. Create a user in the DB
      return User.create({
        _id: info.username,
        encryptedPassword: encryptedPassword
      });
    })
    .then(function(user) {
      // 3. Return ok response
      response.json({
        status: 'ok'
      });
    })
    .catch(function(err) {
      // 4. One catch-all error handling function for returning an error response
      var message = formatMongooseError(err);
      response.status(err.status);
      response.json({ status: 'fail', error: message });
    });
});
