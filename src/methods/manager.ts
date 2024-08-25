
import { Car_Manager } from "./car_methods";
import { Client_Manager } from "./client_methods";
import { Sale_Manager } from "./sale_methods";

export class Manager {
  public client: Client_Manager;
  public car: Car_Manager;
  public sale: Sale_Manager;
};
