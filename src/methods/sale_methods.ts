import { Repository } from "typeorm";
import { Car } from "../entity/Car";
import { Client } from "../entity/Client";
import { Sale } from "../entity/Sale";

export async function addSale( client: Client, car: Car, price: number, sale_table: Repository<Sale>): Promise<Sale> {
  const sale = new Sale(client, car, price)

  await sale_table.save(car)

  return sale;
}

export async function getSales(sale_table: Repository<Sale>): Promise<Sale[]> {

  return await sale_table.find();
}
