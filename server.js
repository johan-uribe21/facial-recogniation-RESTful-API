const express= require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const helmet = require('helmet');

const register = require ('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



// initializes the connection to the database over the local host
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL, // heroku url to database
    ssl: true,
  }
});

// starts the server using express
const app = express();
// loads the middleware which parses all json and does the cors
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

// root route to see if server is working and responding
app.get('/', (req, res) => {res.json("Server is live")});

// returns user object if password matches the stored hash in login table
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

// adds new user object into the postgresql database using knex
// inject the dependencies db and bcrypt into the register function
app.post('/register', (req, res) =>  {register.handleRegister(req, res, db, bcrypt)});

// this route not used yet, could be used to look up user profiles
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

// updates the entries field in the database each time an image in submitted
app.put('/image', (req, res) => {image.handleImagePut(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {console.log(`app is running on port ${process.env.PORT}`)});

