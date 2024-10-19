import exp = require("constants");
import * as cors from "cors";
//import * as express from "express"; //framework para API
import * as multer from "multer";
import { AppDataSource } from "./data-source";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { Seller } from "./entity/seller";
import { Manager } from "./methods/manager";
import { populateDB } from "./gen-cars";
import { CarView } from "./view_entity/view";
import { DataSource } from "typeorm";

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
    const seller_table = AppDataSource.getRepository(Seller);

    // database manager
    const db = new Manager();

    db.seller.add(
      "07002233475",
      "jose",
      "alves",
      "10/10/2022",
      "juca123",
      seller_table
    );
    db.seller.add(
      "07012233475",
      "joao",
      "neto",
      "10/10/1902",
      "dslldjs",
      seller_table
    );
    populateDB(20, car_table, client_table, seller_table, sale_table, db);

    // --------------- Cars BEGIN ---------------------
    //GET
    app.get("/cars", async (req, res) => {
      try {
        return res.status(200).json(await db.car.getAvailable(car_table));
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //get all cars
    app.get("/cars/all", async (req, res) => {
      try {
        return res.status(200).json(await db.car.getAll(car_table));
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //POST
    app.post("/cars", upload.none(), async (req, res) => {
      try {
        const data = await req.body;

        await db.car.add(
          Number(data.year),
          data.model[0],
          data.maker,
          Number(data.km),
          car_table
        );
        console.log(`Data: ${data.year}`);
        res.status(201).json(JSON.stringify(data));
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //Filter http://localhost:8080/cars/filter/?model=E46
    app.get("/cars/filter", async (req, res) => {
      try {
        const { model } = req.query;

        const data = await db.car.getModel(model, car_table);

        res.status(200).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    // --------------- Cars END ---------------------
    //----------------- sale BEGIN -------------------------
    //get sales by client
    app.get("/sales/:cpf", async (req, res) => {
      try {
        const data = await db.sale.getByClientCPF(
          req.params.cpf,
          client_table,
          sale_table
        );

        res.status(201).json(data);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    app.post("/sales", async (req, res) => {
      //insert sale
      try {
        const data = await req.body;
        console.log(`Venda recebida: ${JSON.stringify(data)}`);

        await db.sale.addIdCPF(
          data.cpf_seller,
          data.cpf,
          data.car_id,
          Number(data.price),
          seller_table,
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
    app.get("/sales", async (req, res) => {
      try {
        const data = await db.sale.getAll(sale_table);

        console.log(`Dados enviados ${JSON.stringify(data)}`);

        res.status(200).json(data);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    // //get sales by model
    // app.get("/sales/filter", async (req, res) => {
    //   try {
    //     let { model } = req.query;
    //     const data = await db.sale.getByCarModel(model, car_table, sale_table);

    //     console.log(data);
    //     res.status(200).json();
    //   } catch (error) {
    //     res.status(500).send(error.message);
    //   }
    // });

    //----------------- sale END -------------------------

    // ------------------------- Clients BEGIN --------------------------------------
    //create clients
    app.post("/clients", upload.none(), async (req, res) => {
      try {
        const client = await req.body;
        await db.client.add(
          client.CPF,
          client.first_name,
          client.last_name,
          client.birthdate,
          client.is_flamengo,
          client_table
        );

        res
          .status(201)
          .json({ message: "Dados recebidos com sucesso", data: client });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //Get clients
    app.get("/clients", async (req, res) => {
      try {
        const clients = await db.client.getAll(client_table);
        return res.status(200).json(clients);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //get clients by id
    app.get("/clients/:cpf", async (req, res) => {
      try {
        const client = await db.client.getOne(req.params.cpf, client_table);
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
        const client = await db.client.removeByCPF(
          req.params.cpf,
          client_table
        );
        console.log(`Cliente (CPF: ${req.params.cpf}) foi removido`);
        res.status(204).send("Deleted client");
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //update name by cpf
    app.put("/clients/name/:cpf", async (req, res) => {
      try {
        const cpf = req.params.cpf;
        const data = await req.body;

        if (db.client.getOne(cpf, client_table) != null) {
          await db.client.updateName(
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

        if ((await db.client.getOne(cpf, client_table)) != null) {
          console.log("Cliente atualizado");

          await db.client.updateBirthdate(cpf, data.birthdate, client_table);
          return res.status(200).json(data);
        } else {
          console.log("Cliente não atualizado");
          return res.status(200).send("Cliente não existe");
        }
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });

    //filter clients by name
    ///clients/filter?first_name=name&last_name=name
    app.get("/clients/name/filter", async (req, res) => {
      try {
        const { first_name, last_name } = req.query;
        const data = await db.client.getByName(
          first_name,
          last_name,
          client_table
        );

        console.log(last_name);

        return res.status(200).json(data);
      } catch (error) {}
    });
    // ------------------------- Clients END --------------------------------------

    // ------------------------- Seller BEGIN ------------------------------------
    // Rota de login para vendedores
    app.post("/login", async (req, res) => {
      const { cpf, password } = req.body;

      console.log(cpf);
      console.log(password);
      try {
        // Verifica se o vendedor existe
        const seller = await db.seller.getOne(cpf, seller_table);

        if (!seller) {
          return res.status(401).json({ message: "Vendedor não encontrado." });
        }

        // Verifica a senha
        const isPasswordValid = await db.seller.login(
          cpf,
          password,
          seller_table
        );

        if (isPasswordValid) {
          return res.status(200).json({ message: "Login bem-sucedido." });
        } else {
          return res.status(401).json({ message: "Senha inválida." });
        }
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });
    // ------------------------- Seller END --------------------------------------

    app.get("/teste", async (req, res) => {
      const data = await AppDataSource.manager.find(CarView);

      return res.status(200).json(data);
    });

    app.listen(port, () => {
      console.log(`Rodando na porta ${port}.`);
    });
  })
  .catch((error) => console.log(error));
