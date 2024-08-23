import exp = require("constants");
import * as cors from "cors";
import * as express from "express"; //framework para API
import { AppDataSource } from "./data-source";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { getAllCars } from "./methods/car_methods";
import { addClient, getClient } from "./methods/client_methods";

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port: number = 8080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

AppDataSource.initialize()
  .then(async () => {
    //------------- getting tables ---------------
    const client_table = AppDataSource.getRepository(Client);
    const car_table = AppDataSource.getRepository(Car);
    const sale_table = AppDataSource.getRepository(Sale);

<<<<<<< HEAD
    addClient(
      "44011199920",
      "Duel",
      "Hugo",
      new Date("2000-02-08"),
      client_table
    );

=======
>>>>>>> da51bc5 (date to string)
    //GET
    app.get("/cars", async (req, res) => {
      try {
        return res.status(200).json(await getAllCars(car_table));
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //POST
    app.post("/cars", async (req, res) => {
      try {
        const data = await req.body;
        console.log(`Data: ${JSON.stringify(data)}`);
        res.status(201).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //SELL CAR BY ID -> INSERT INTO SALE TABLE AND UPDATE CAR STATUS
    app.post("/sell/:id", async (req, res) => {
      //INSERT
      try {
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //Clients
    app.get("/clients/:id", async (req, res) => {
      try {
        const client = await getClient(req.params.id, client_table);
        let is_client = true;

        if (client == null) {
          is_client = false;
        }
        return res.status(200).json({ isClient: is_client });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
