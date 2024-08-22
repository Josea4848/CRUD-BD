import exp = require("constants");
import * as express from "express"; //framework para API
import { AppDataSource } from "./data-source";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
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

    //------------- getting tables ---------------
    const client_table = AppDataSource.getRepository(Client)
    const car_table = AppDataSource.getRepository(Car);
    const sale_table = AppDataSource.getRepository(Sale);


    //GET
    app.get("/cars", async (req, res) => {
      try {
        return res.status(200).send("<h1>Olá, mundo</h1>");
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
    app.post("/sell/:id", async (req, res) => { //INSERT
      try{
        //nothing
      } catch (error) {
        return res.status(500).send(error.message);
      }
    })
    app.put("/sell/:id", async (req, res) => {
      try {

      } catch (error){
        return res.status(500).send(error.message);
      }
    })


    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
