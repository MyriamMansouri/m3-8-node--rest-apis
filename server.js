"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

let { clients } = require("./data/clients");

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
    const name = req.body.name
    const email = req.body.email
    const client = new Client(uuidv4(), name, email);
    clients.push(client);
    res.status(201).json({ status: 201, client: client });
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

  // General 404 page
  .get("*", (req, res) => {
    res.status(404).json({ status: 404, error: "This page doesn't exist" });
  })

  .listen(8000, () => console.log(`Listening on port 8000`));
