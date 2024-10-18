import { Car_Manager } from "./car_methods";
import { Client_Manager } from "./client_methods";
import { Sale_Manager } from "./sale_methods";
import { Seller_Manager } from "./seller_methods";

export class Manager {
  public client: Client_Manager;
  public car: Car_Manager;
  public sale: Sale_Manager;
  public seller: Seller_Manager;

  constructor() {
    this.client = new Client_Manager();
    this.car = new Car_Manager();
    this.sale = new Sale_Manager(this.car, this.client);
    this.seller = new Seller_Manager();
  }
}
