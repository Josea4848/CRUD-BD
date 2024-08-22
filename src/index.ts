import exp = require("constants");
import * as express from "express"; //framework para API
import { AppDataSource } from "./data-source";
import { Car, Service } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { addCar, getCars } from "./methods/car_methods";
import { addClient, getClients } from "./methods/client_methods";
import { addSale, getSales } from "./methods/sale_methods";

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
    const car_table = AppDataSource.getRepository(Car);
    const client_table = AppDataSource.getRepository(Client);
    const sale_table = AppDataSource.getRepository(Sale);

    // a tabela sale talvez n funcione
    // se n funcionar, roda isso abaixo:
    //
    // const s = new Sale()
    // AppDataSource.manager.save(s)

    //--------- addCar(year, model, brand, km, service, table)
    const car = addCar(2020, "camaro", "chevrolet", 0, Service.RENT, car_table);

    //------------ addClient(CPF, first_name, last_name, birthdate, table)
    const client = addClient("02248869401", "samuel", "sla", new Date('2004-06-04'), client_table)

    //---------- addSale(client, car, price, table)
    const sale = addSale(await client, await car, 9999.10, sale_table);

    //---------- printing -----------
    console.log(await getCars(car_table))
    console.log(await getClients(client_table))
    console.log(await getSales(sale_table))
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
