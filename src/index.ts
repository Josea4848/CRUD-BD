import exp = require("constants");
import * as express from "express"; //framework para API
import { AppDataSource } from "./data-source";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { addCar, getAllCars, getAvailableCars } from "./methods/car_methods";
import * as cors from "cors";
import { addSaleIdCPF } from "./methods/sale_methods";
import {
  addClient,
  getAllClients,
  getClient,
  removeClientCPF,
} from "./methods/client_methods";

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

    addClient("22233344488", "João", "Alves", "2004/03/04", client_table);
    addClient("22233345488", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22232344488", "João", "Alves", "2004/03/04", client_table);
    addClient("22231345488", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22433344488", "João", "Alves", "2004/03/04", client_table);
    addClient("22833345488", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22033344488", "João", "Alves", "2004/03/04", client_table);
    addClient("20033345488", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("00033344488", "João", "Alves", "2004/03/04", client_table);
    addClient("22233345478", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22233344477", "João", "Alves", "2004/03/04", client_table);
    addClient("22233345466", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22233344444", "João", "Alves", "2004/03/04", client_table);
    addClient("22233345411", "Akita", "Fabinho", "1995/03/03", client_table);
    addClient("22233344455", "João", "Alves", "2004/03/04", client_table);
    addClient("22233345433", "Akita", "Fabinho", "1995/03/03", client_table);

    //GET
    app.get("/cars", async (req, res) => {
      try {
        return res.status(200).json(await getAvailableCars(car_table));
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
    app.post("/sell", async (req, res) => {
      //INSERT
      try {
        const data = await req.body;
        console.log(`Venda recebida: ${data}`);
        await addSaleIdCPF(
          data.cpf,
          data.car_id,
          2000,
          client_table,
          car_table,
          sale_table
        );
        res.status(201).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    // ------------------------- Clients --------------------------------------

    //create clients
    app.post("/clients", async (req, res) => {
      try {
        const data = await req.body;
        console.log(`Solitição de registro de cliente ${data}`);
        res.status(200).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //Get clients
    app.get("/clients", async (req, res) => {
      try {
        const clients = await getAllClients(client_table);
        console.log(clients);
        return res.status(200).json(clients);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //get clients by id
    app.get("/clients/:cpf", async (req, res) => {
      try {
        const client = await getClient(req.params.cpf, client_table);
        let is_client = true;

        if (client == null) {
          is_client = false;
        }
        return res.status(200).json({ isClient: is_client });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //delete client by cpf
    app.delete("/clients/:cpf", async (req, res) => {
      try {
        const client = await removeClientCPF(req.params.cpf, client_table);
        console.log(`Client (CPF: ${req.params.cpf}) was deleted`);
        res.status(200).json(client);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
