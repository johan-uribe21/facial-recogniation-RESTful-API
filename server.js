const express= require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// initializes the connection to the database over the local host
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1', // local host
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

// starts the server using express
const app = express();
// loads the middleware which automatically parses all json and does the cors
app.use(bodyParser.json());
app.use(cors());

// root route to see if server is working and responding
app.get('/', (req, res) => {
  res.json(database.users);
})

// use post for sign in even though we are not posting new data because
// we want to hide the password in an https post request rather than 
// leaving it visible in a get request
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    // compares the hashed password to the user supplied login password
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // boolean
    if (isValid){
      return db.select('*').from('users').where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'));
    } else {
      res.status(400).json('wrong credentials');
    }
  })
  .catch(err => res.status(400).json('wrong credentials'));
});

// push a new user object into the postgresql database using knex
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  const hash = bcrypt.hashSync(password); // hashes the pw
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginemail => { //
        return trx('users')
          .returning('*') // knex function that returns all the added data '*'
          .insert({
          email: loginemail[0],
          name: name,
          joined: new Date()
          })
          .then(user => {
            res.json(user[0]); // returns the last user registered
          })
      })
      .then(trx.commit) // commits all transactions if succesful
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  db.select('*').from('users')
    .where({id})
    .then(user=> { 
      if(user.length){
        res.json( user[0] ) ;
      } else {
        res.status(400).json('error getting user');
      }
    })
    .catch(err => res.status(400).json('error'));
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1) // knex function to increment cell by 1
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
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