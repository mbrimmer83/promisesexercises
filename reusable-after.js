// Reusable function example after promises.

app.get('/register', function(request, response, next) {
  var info = request.body;
  registerUser(info.username, info.password)
    .then(function() {
      response.json({ status: 'ok' });
    })
    .catch(next);
});

function registerUser(username, password) {
  return bcrypt.hash(info.password, 10)
    .then(function(encryptedPassword) {
      return User.create({
        _id: info.username,
        encryptedPassword: encryptedPassword
      });
    });
}
