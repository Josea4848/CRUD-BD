import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
import { CarView } from "./view_entity/view";
import { Seller } from "./entity/seller";
//import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "crud_bd",
  synchronize: true,
  logging: false,
  entities: [Client, Car, Sale, CarView, Seller],
  migrations: [],
  subscribers: [],
});
