var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect("mongodb://localhost/coffee-store");
mongoose.Promise = require('bluebird');
var bcrypt = require('bcrypt-as-promised');
var User = require("./usermodel");
var randtoken = require('rand-token');
var app = express();
app.use(bodyParser.json());

app.get('/options', function(request, response) {
  response.json ([
    'Extra coarse',
    'Coarse',
    'Medium coarse',
    'Medium',
    'Medium-Fine',
    'Fine',
    'Extra Fine'
  ]);
});

app.post("/signup", function(request, response){
  var userInfo = request.body;
  bcrypt.hash(userInfo.password, 10)
    .then(function(hash) {
      var user = new User({
        _id: userInfo.username,
        encrpytedPassword: hash
      });
      return user.save();
    })
    .then(function(){
      console.log("User saved");
      response.json({
          status:"OK"
      });
    })
    .catch(function(err){
      if(err){
        console.log(err.message);
        response.status(409);
        response.json({
          status: "fail",
          message:"Username has been taken"
        });
        return;
      }
    });
});

app.post('/login', function(request, response){
  var userInfo = request.body;
  User.findById(userInfo.username)
    .then(function(user){
      return bcrypt.compare(userInfo.password, user.encrpytedPassword);
    })
    .then(function(res){
      if (res === true) {
       var token = randtoken.generate(64);
       return User.update(
         { _id: userInfo.username},
         { $push: { authenticationTokens: token } }, {upsert: true}
       );
     }
    })
    .then(function(token, user){
      return [token]
    })
    .catch(function(err, reply){
      if (err) {
        response.json({
          status: "fail",
          message: "Invalid username or password"
        });
        return;
      }
      console.log('Update succeeded', reply);
    });
    response.json({
      status: "OK"
    });
});

app.post('/orders', function(request, response){
  var userInfo = request.body;
  var token = userInfo.token;
  User.findOne({authenticationTokens: token}, function(err, user){

    if (!user) {
      response.json({
        status: "fail",
        message: "User is not authorized"
      });
      return;
    }
    user.orders.push(userInfo.order);
    console.log(userInfo.order);
    user.save(function(err){
      if (err) {
        var validationErrors = [];
        for (var key in err.errors) {
          validationErrors.push(err.errors[key].message);
        }
        response.json({
          status: 'failed',
          message: 'Order failed. ' + err.message + '. ' + validationErrors.join(' ')
        });
        return;
      }
      response.json({ status: 'Ok'});
    });
  });
});

app.get('/orders', function(request, response){
  var userInfo = request.query;
  var token = userInfo.token;
  console.log(token);
  User.findOne({authenticationTokens: token}, function(err, user){
    if (err){
      console.log(err.message);
      return;
    }
    response.json({orders: user.orders});
  });
});
app.listen(3000, function(){
  console.log('Listening on port 3000');
});
