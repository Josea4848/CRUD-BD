import { Repository } from "typeorm";
import { Car} from "../entity/Car";

export async function addCar( year: number, model: string, brand: string, km: number, car_table: Repository<Car>): Promise<Car> {

  const car = new Car(year, model, brand, km);

  await car_table.save(car);

  return car;
}

export async function getAllCars(car_table: Repository<Car>): Promise<Car[]> {
  return await car_table.find();
}

export async function getCar(car_id: number, car_table: Repository<Car>): Promise<Car[]> {
  return await car_table.findBy({id: car_id})
}
