import { Repository } from "typeorm";
import { Car } from "../entity/Car";
import { Client } from "../entity/Client";
import { Sale } from "../entity/Sale";
import { Car_Manager } from "./car_methods";
import { Client_Manager, isCPFValid } from "./client_methods";

export class Sale_Manager {
  private car_sale: Car_Manager;
  private client_sale: Client_Manager;

  constructor(car: Car_Manager, client: Client_Manager) {
    this.car_sale = car;
    this.client_sale = client;
  }

  //----------------------------------------- CREATE ---------------------------------------------
  public async addOne(
    client: Client,
    car: Car,
    value: number,
    car_table: Repository<Car>,
    sale_table: Repository<Sale>
  ): Promise<Sale> {
    if (typeof value !== "number" || isNaN(value)) {
      return null;
    }

    const sale = new Sale(car.id, client, car, value);

    await sale_table.save(sale);

    car_table.update(car.id, { sold: true });

    return sale;
  }

  public async addIdCPF(
    client_CPF: string,
    car_id: number,
    value: number,
    client_table: Repository<Client>,
    car_table: Repository<Car>,
    sale_table: Repository<Sale>
  ): Promise<Sale> {
    if (typeof value !== "number" || isNaN(value)) {
      return null;
    }

    const client = await this.client_sale.getOne(client_CPF, client_table);
    const car = await this.car_sale.getOne(car_id, car_table);

    const sale = new Sale(car_id, client, car, value);

    await sale_table.save(sale);

    car_table.update(car_id, { sold: true });

    return sale;
  }

  //------------------------------------------ READ ---------------------------------------------
  public async getAll(sale_table: Repository<Sale>): Promise<Sale[]> {
    return await sale_table.find({ relations: { car: true, client: true } });
  }

  public async getOne(
    car_id: number,
    sale_table: Repository<Sale>
  ): Promise<Sale> {
    return await sale_table.findOne({
      relations: { car: true, client: true },
      where: { id: car_id },
    });
  }

  public async getByClient(
    client: Client,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    return await sale_table.find({
      relations: { client: true, car: true },
      where: { client: client },
    });
  }

  public async getByCar(
    car: Car,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    return await sale_table.find({
      relations: { client: true, car: true },
      where: { car: car },
    });
  }

  public async getByClientCPF(
    CPF: string,
    client_table: Repository<Client>,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    if (isCPFValid(CPF)) {
      const client = await this.client_sale.getOne(CPF, client_table);
      return await sale_table.find({
        relations: { client: true, car: true },
        where: { client: client },
      });
    }
  }

  public async getByName(
    first_name: string,
    last_name: string,
    client_table: Repository<Client>,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    const clients: Client[] = await this.client_sale.getByName(
      first_name,
      last_name,
      client_table
    );

    var sales: Sale[] = [];

    if (clients != null) {
      for (var client of clients) {
        sales.push(...(await this.getByClient(client, sale_table)));
      }
      return sales;
    }
    return null;
  }

  public async getByCarBrand(
    brand: string,
    car_table: Repository<Car>,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    const cars: Car[] = await this.car_sale.getByBrand(brand, car_table);

    var sales: Sale[] = [];

    if (cars != null) {
      for (var car of cars) {
        sales.push(...(await this.getByCar(car, sale_table)));
      }
      return sales;
    }
    return null;
  }

  public async getByCarModel(
    model: string,
    car_table: Repository<Car>,
    sale_table: Repository<Sale>
  ) {
    const cars: Car[] = await this.car_sale.getModel(model, car_table);

    let sales: Sale[] = [];

    if (cars != null) {
      for (let car of cars) {
        sales.push(...(await this.getByCar(car, sale_table)));
      }
      return sales;
    }
    return null;
  }

  public async getByDate(
    date: string,
    sale_table: Repository<Sale>
  ): Promise<Sale[]> {
    return await sale_table.find({
      relations: { client: true, car: true },
      where: { date: date },
    });
  }

  // public async getAllRelation(sale_table: Repository<Sale>) {
  //   return await sale_table
  //     .createQueryBuilder("sale")
  //     .leftJoin("sale.client", "client")
  //     .leftJoin("sale.car", "car")
  //     .select(["sale", "client", "car"])
  //     .getMany();
  // }

  //--------------------------------------- UPDATE ---------------------------------------------
  public async updatePrice(
    car_id: number,
    new_price: number,
    sale_table: Repository<Sale>
  ): Promise<void> {
    if (new_price == null) {
      throw new Error("Trying to update sale price to null");
    } else {
      await sale_table.update(car_id, { price: new_price });
    }
  }

  //--------------------------------------- DELETE ---------------------------------------------
  public async removeOne(
    sale: Sale,
    sale_table: Repository<Sale>
  ): Promise<void> {
    sale_table.remove(sale);
  }

  public async removeById(
    car_id: number,
    sale_table: Repository<Sale>
  ): Promise<void> {
    const sale = await this.getOne(car_id, sale_table);
    sale_table.remove(sale);
  }
}
