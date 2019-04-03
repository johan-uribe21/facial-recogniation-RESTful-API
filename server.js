const express= require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

// starts the server using express
const app = express();
// loads the middleware which automatically parses all json
app.use(bodyParser.json());
app.use(cors());

// a fake database since we have not built real database yet
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      password: 'bananas',
      email: 'Sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
};

// root route to see if server is working and responding
app.get('/', (req, res) => {
  res.json(database.users);
})

// use post for sign in even though we are not posting new data because
// we want to hide the password in an https post request rather than 
// leaving it visible in a get request
app.post('/signin', (req, res) => {
  // bcrypt.compare("bacon", hash, function(err, res) {
  //   // res == true
  // });
  // bcrypt.compare("veggies", hash, function(err, res) {
  //   // res = false
  // });
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password){
      res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
  res.json('signin')
})

// push a new user object into the database user-array
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  // returns the last user added
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach( user => {
    if (user.id === id){
      found = true;
      return res.json(user);
    } 
  })
  if(!found) res.status(400).json('user not found');
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  let found = false;
  database.users.forEach( user => {
    if (user.id === id){
      found = true;
      user.entries++;
      return res.json(user.entries);
    } 
  })
  if(!found) res.status(400).json('user not found');
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });


/*
These are the routes of our api.  
/ --> res = this is working
/signin --> POST will respond with = success/fail
  Signin needs to be a post in order to hide the password in https
/register --> POST = {new user object}
/profile/:userId --> GET = user
/image --> PUT  --> updated user-profile object increase entries

*/