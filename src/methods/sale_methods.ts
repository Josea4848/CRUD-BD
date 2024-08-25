import { Repository } from "typeorm";
import { Car } from "../entity/Car";
import { Client } from "../entity/Client";
import { Sale } from "../entity/Sale";
import { Car_Manager } from "./car_methods";
import { Client_Manager } from "./client_methods";

export class Sale_Manager{

  private car_sale: Car_Manager
  private client_sale: Client_Manager

  constructor(car: Car_Manager, client: Client_Manager){
    this.car_sale = car;
    this.client_sale = client;
  }

  //----------------------------------------- CREATE ---------------------------------------------
  public async addOne( client: Client, car: Car, value: number, car_table: Repository<Car>, sale_table: Repository<Sale>): Promise<Sale> {
    const sale = new Sale(car.id, client, car, value)

    await sale_table.save(sale)

    car_table.update(car.id, {sold: true})

    return sale;
  }

  public async addIdCPF( client_CPF: string, car_id:number, value: number, client_table: Repository<Client>, car_table: Repository<Car>, sale_table: Repository<Sale>): Promise<Sale> {

    const client = await this.client_sale.getOne(client_CPF, client_table);
    const car = await this.car_sale.getOne(car_id, car_table)

    const sale = new Sale(car_id, client, car, value)

    await sale_table.save(sale)

    car_table.update(car_id, {sold: true})

    return sale;
  }

  //------------------------------------------ READ ---------------------------------------------
  public async getAll(sale_table: Repository<Sale>): Promise<Sale[]> {
    return await sale_table.find();
  }

  public async getOne(car_id: number, sale_table: Repository<Sale>): Promise<Sale> {
    return await sale_table.findOneBy({id: car_id})
  }

  public async getByClient(client: Client, sale_table: Repository<Sale>): Promise<Sale[]> {
    return await sale_table.findBy({ client: client })
  }

  public async getByDate(date: string, sale_table: Repository<Sale>): Promise<Sale[]>{
  return await sale_table.findBy({date: date})
  }

  //--------------------------------------- UPDATE ---------------------------------------------
  public async updatePrice(car_id: number, new_price: number, sale_table: Repository<Sale>): Promise<void> {
    if(new_price == null){
      throw new Error("Trying to update sale price to null")
    }else{
      await sale_table.update(car_id, {price: new_price})
    }
  }

  //--------------------------------------- DELETE ---------------------------------------------
  public async removeOne(sale: Sale, sale_table: Repository<Sale>): Promise<void> {
    sale_table.remove(sale);
  }

  public async removeById(car_id: number, sale_table: Repository<Sale>): Promise<void> {
    const sale = await this.getOne(car_id, sale_table);
    sale_table.remove(sale);
  }
}
