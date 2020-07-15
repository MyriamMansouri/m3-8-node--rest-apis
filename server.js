"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

let { clients } = require("./data/clients");
let { words } = require("./data/words");
let guess;
class Client {
  constructor(id, name, email) {
    this.id = id;
    this.isActive = true;
    this.age = 0;
    this.name = name;
    this.gender = "";
    this.company = "";
    this.email = email;
    this.phone = "";
    this.address = "";
  }
}

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  //get the list of clients
  .get("/clients", (req, res) => {
    res.status(200).json({ status: 200, clients: clients });
  })

  //get specific client
  .get("/clients/:id", (req, res) => {
    const id = req.params.id;
    try {
      const client = clients.find((client) => client.id === id);
      if (client) {
        res.status(200).json({ status: 200, client: client });
      } else {
        throw "This client doesn't exist";
      }
    } catch (err) {
      res.status(404).json({ status: 404, error: err });
    }
  })

  //add a new client
  .post("/clients/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    try {
      const client = clients.find(
        (client) => client.name === name || client.email === email
      );
      if (!client) {
        const newClient = new Client(uuidv4(), name, email);
        clients.push(newClient);
        res.status(201).json({ status: 201, client: newClient });
      } else {
        throw "This client already exists";
      }
    } catch (err) {
      res.status(400).json({ status: 400, error: err });
    }
  })

  .delete("/clients/:id", (req, res) => {
    const id = req.params.id;

    try {
      const client = clients.find((client) => client.id === id);
      if (client) {
        clients = clients.filter((client) => client.id !== id);
        res.status(200).json({ status: 200, client: client });
      } else {
        throw "This client doesn't exist";
      }
    } catch (err) {
      res.status(404).json({ status: 404, error: err });
    }
  })


  // Hangman API

  .get("/hangman/word", (req, res) => {
    const index = Math.floor(Math.random() * words.length);
    const { id, letterCount } = words[index];
    guess = new Array(Number(letterCount)).fill(false);
    res.status(200).json({ status: 200, id: id, letterCount: letterCount });
  })

    .get("/hangman/guess/:id/:letter", (req, res) => {
    const { id, letter } = req.params;
    const myWord = words.find((word) => word.id === id.toString()).word.split("")
 
    for (let i = 0; i < guess.length; i++) {
      if (myWord[i] === letter) guess[i] = true;
    }

    res.status(200).json({ status: 200, guess: guess });
  })

  // General 404 page
  .get("*", (req, res) => {
    res.status(404).json({ status: 404, error: "This page doesn't exist" });
  })

  .listen(8000, () => console.log(`Listening on port 8000`));
