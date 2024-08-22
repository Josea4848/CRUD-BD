import { Repository } from "typeorm";
import { Car } from "../entity/Car";
import { Client } from "../entity/Client";
import { Sale } from "../entity/Sale";
import { getCar } from "./car_methods";
import { getClient } from "./client_methods";

export async function addSale( client: Client, car: Car, value: number, client_table: Repository<Client>, car_table: Repository<Car>, sale_table: Repository<Sale>): Promise<Sale> {
  const sale = new Sale(car.id, client, car, value)

  await sale_table.save(sale)

  car_table.update(car.id, {sold: true})

  return sale;
}

export async function addSaleIdCPF( client_CPF: string, car_id:number, value: number, client_table: Repository<Client>, car_table: Repository<Car>, sale_table: Repository<Sale>): Promise<Sale> {

  const client = await getClient(client_CPF, client_table);
  const car = await getCar(car_id, car_table)

  const sale = new Sale(car_id, client, car, value)

  await sale_table.save(sale)

  car_table.update(car_id, {sold: true})

  return sale;
}

export async function getAllSales(sale_table: Repository<Sale>): Promise<Sale[]> {
  return await sale_table.find();
}

export async function getSale(car_id: number, sale_table: Repository<Sale>): Promise<Sale> {
  return await sale_table.findOneBy({id: car_id})
}

export async function getClientSales(client: Client, sale_table: Repository<Sale>): Promise<Sale[]> {
  return await sale_table.findBy({ client: client })
}

export async function removeSale(sale: Sale, sale_table: Repository<Sale>): Promise<void> {
  sale_table.remove(sale);
}

export async function removeSaleId(car_id: number, sale_table: Repository<Sale>): Promise<void> {
  const sale = await getSale(car_id, sale_table);
  sale_table.remove(sale);
}
