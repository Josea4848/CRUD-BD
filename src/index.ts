import exp = require("constants");
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express"; //framework para API

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port: number = 8080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );

    //Endpoints

    //GET
    app.get("/users", async (req, res) => {
      try {
        return res.status(200).send("<h1>Olá, mundo</h1>");
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //POST
    app.post("/users", async (req, res) => {
      try {
        const data = await req.body;
        console.log(`Data: ${JSON.stringify(data)}`);
        res.status(201).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
