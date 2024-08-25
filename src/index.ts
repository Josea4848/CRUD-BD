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
  isCPFValid,
  removeClientCPF,
  updateClientBirthdate,
  updateClientName,
} from "./methods/client_methods";
import * as multer from "multer";

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const upload = multer();
const app = express();
const port: number = 8080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

AppDataSource.initialize()
  .then(async () => {
    //------------- getting tables ---------------
    const client_table = AppDataSource.getRepository(Client);
    const car_table = AppDataSource.getRepository(Car);
    const sale_table = AppDataSource.getRepository(Sale);

    // --------------- Cars ---------------------
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

    //----------------- sale -------------------------
    app.post("/sell", async (req, res) => {
      //insert sale
      try {
        const data = await req.body;
        console.log(`Venda recebida: ${data}`);
        await addSaleIdCPF(
          data.cpf,
          data.car_id,
          data.price,
          client_table,
          car_table,
          sale_table
        );
        res.status(201).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //get all sales
    app.get("/sell", async (req, res) => {});

    // ------------------------- Clients --------------------------------------
    //create clients
    app.post("/clients", upload.none(), async (req, res) => {
      try {
        const client = await req.body;
        await addClient(
          client.CPF,
          client.first_name,
          client.last_name,
          client.birthdate,
          client_table
        );

        res
          .status(200)
          .json({ message: "Dados recebidos com sucesso", data: client });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //Get clients
    app.get("/clients", async (req, res) => {
      try {
        const clients = await getAllClients(client_table);
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

    //update name by cpf
    app.put("/clients/name/:cpf", async (req, res) => {
      try {
        const cpf = req.params.cpf;
        const data = await req.body;

        if (getClient(cpf, client_table) != null) {
          await updateClientName(
            cpf,
            data.first_name,
            data.last_name,
            client_table
          );
          return res.status(200).json(data);
        } else {
          return res.status(200).send("Cliente não existe");
        }
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //update birthdate by cpf
    app.put("/clients/date/:cpf", async (req, res) => {
      try {
        const cpf = req.params.cpf;
        const data = await req.body;

        if (isCPFValid(cpf) && (await getClient(cpf, client_table)) != null) {
          console.log("Cliente atualizado");

          await updateClientBirthdate(cpf, data.birthdate, client_table);
          return res.status(200).json(data);
        } else {
          console.log("Cliente não atualizado");
          return res.status(200).send("Cliente não existe");
        }
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
