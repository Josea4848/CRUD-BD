import { Repository } from "typeorm";
import { Car, Service } from "../entity/Car";

export async function addCar( year: number, model: string, brand: string, km: number, service: Service, car_table: Repository<Car>): Promise<Car> {

  const car = new Car(year, model, brand, km, service);

  await car_table.save(car);

  return car;
}

export async function getCars(car_table: Repository<Car>): Promise<Car[]> {
  return await car_table.find();
}
