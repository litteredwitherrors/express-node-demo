// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost/express-node-demo');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Todo = mongoose.model('Todo', {
		text : String
});

app.get('/todos', function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
			res.send(err)
		}
    res.json(todos); // return all todos in JSON format
  });
});

app.post('/todos', function(req, res) {
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo) {
      if (err) {
				res.send(err);
			}
    Todo.find(function(err, todos) {
      if (err) {
				res.send(err)
			}
      res.json(todos);
    });
  });
});

// delete a todo
app.delete('/todos/:todo_id', function(req, res) {
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err) {
			res.send(err);
		}
    Todo.find(function(err, todos) {
      if (err) {
				res.send(err)
			}
      res.json(todos);
    });
  });
});

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");
