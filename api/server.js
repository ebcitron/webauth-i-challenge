const express = require("express");
const helmet = require("helmet");
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const Users = require('../users/usersModel');
const KnexSessionsStore = require("connect-session-knex")(session);
const server = express();
server.use(express.json());
server.use(helmet());

// server.use("/api/register", registrationRouter);
// server.use("/api/login", loginRouter);
// server.get("/", (req,res) => {
//     res.send("Welcome to the server!");
// });
const sessionConfig = {
    name: "monster", // defaults to sid, but we should change this as that clues in on our stack
    secret: "keep it safe, keep it secret -gandalf", // used to encrypt/decrypt the cookie (use a .env file here)
    cookie: {
      maxAge: 1000 * 60 * 60, // (this is 1 hr) how long the session is valid for in millisec
      secure: false // used for https only communications, should be true in production
    },
    httpOnly: true, // cannot access the cookie from JS using document.cookie
    // keep this to true unless you have a very good reason to not have it as true
    resave: false, // keep it false to avoid recreating sessions that have not changed
    saveUninitialized: false, // GDPR Laws against setting cookies automatically
  
    // we add this to configure the way sessions are stored
    store: new KnexSessionsStore({
      knex: require("../database/dbConfig"), // configures the instance of knex
      tablename: "sessions", // table that will store sessions inside the db, name it anything we want
      sidfieldname: "sid", // column that will hold the session id, name this whatever we want
      createtable: true, // if the table does not exist, it will be created automatically for us
      clearInterval: 1000 * 60 * 60 //the amount of time before checking old sessions and removing them from te database to keep everything clean and performant
    })
  };

server.get('/', (req, res) => {
    req.session.name = "Eli";
    res.send("got the name");
});

server.get('/greet', (req,res) => {
 console.log('req.session.name', req.session.name);
     const name = req.session.name;
    res.send(`hello ${name}`);
});
server.use(cors());
server.use(session(sessionConfig));


server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;
    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = server;