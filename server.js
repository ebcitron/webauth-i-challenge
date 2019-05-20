const express = require("express");
const helmet = require("helmet");
const bcrypt = require('bcryptjs');
const cors = require('cors');
// const loginRouter = require("./data/login/loginRouter.js");
// const registrationRouter = require("./data/registration/registrationRouter.js");
const Users = require('./data/users/usersModel');
const server = express();
server.use(express.json());
server.use(helmet());

// server.use("/api/register", registrationRouter);
// server.use("/api/login", loginRouter);
server.get("/", (req,res) => {
    res.send("Welcome to the server!");
});

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