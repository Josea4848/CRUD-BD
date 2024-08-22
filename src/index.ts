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

    // a tabela sale talvez n funcione
    // se n funcionar, roda isso abaixo:
    //
    // const s = new Sale()
    // AppDataSource.manager.save(s)

    //----------- addCar(year, model, brand, km, service, table)
    //const car = await addCar(2020, "camaro", "chevrolet", 0, car_table);

    //------------ addClient(CPF, first_name, last_name, birthdate, table)
    //const client = await addClient("02244889617", "jose", "duel", new Date("2022-10-9"), client_table)

    //------------ addSale(client, car, price, table)
    //const sale = await addSale( client.CPF, i, 1111.20, client_table, car_table,sale_table);
    //console.log(await getClientSales(client, sale_table))

    //---------- printing -----------
    //Endpoints

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
