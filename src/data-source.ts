import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Car } from "./entity/Car";
import { Client } from "./entity/Client";
import { Sale } from "./entity/Sale";
//import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  synchronize: true,
  logging: false,
  entities: [Client, Car, Sale],
  migrations: [],
  subscribers: [],
});
