const express= require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'Sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
};

app.get('/', (req, res) => {
  res.json(database.users);
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password){
      res.json('success')
  } else {
    res.status(400).json('error logging in');
  }
  res.json('signin')
})

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
  res.json(database.users[database.users.length-1]);
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})


/*
These are the routes of our api.  
/ --> res = this is working
/signin --> POST will respond with = success/fail
  Signin needs to be a post in order to hide the password in https
/register --> POST = {new user object}
/profile/:userId --> GET = user
/image --> PUT  --> updated user-profile object

*/