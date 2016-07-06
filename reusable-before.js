// Reusable function example before promises.

app.get('/register', function(request, response, next) {
  var info = request.body;
  registerUser(info.username, info.password, function(err) {
    if (err) {
      next(err);
      return;
    }
    response.json({ status: 'ok' });
  });
});

// How to write the reusable function:

function registerUser(username, password, callback) {
  bcrypt.hash(password, 10, function(err, encryptedPassword) {
    if (err) {
      callback(err);
      return;
    }
    User.create({
      _id: username,
      encryptedPassword: encryptedPassword
    }, function(err, user) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, user);
    });
  });
}
