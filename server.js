const express= require('express');
const bodyParser = require('body-parser');

// starts the server using express
const app = express();
// loads the middleware which automatically parses all json
app.use(bodyParser.json());

// a fake database since we have not built real database yet
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

// root route to see if server is working and responding
app.get('/', (req, res) => {
  res.json(database.users);
})

// use post for sign in even though we are not posting new data because
// we want to hide the password in an https post request rather than 
// leaving it visible in a get request
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


/*
These are the routes of our api.  
/ --> res = this is working
/signin --> POST will respond with = success/fail
  Signin needs to be a post in order to hide the password in https
/register --> POST = {new user object}
/profile/:userId --> GET = user
/image --> PUT  --> updated user-profile object increase entries

*/