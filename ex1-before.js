/*
# Before

This Express handler signs up a new user by using these steps:

1. Use bcrypt to encrypt the user's password
2. Return error response if bcrypt failed
3. Create a user in the DB
4. Return error response if created failed
5. Return ok response

*/
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
