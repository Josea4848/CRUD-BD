import { Repository } from "typeorm";
import { Car } from "../entity/Car";

//----------------------------------------- CREATE ---------------------------------------------
export async function addCar(year: number, model: string, brand: string, km: number, car_table: Repository<Car>): Promise<Car> {

  if (checkYearKm(year, km)){
    const car = new Car(year, model, brand, km);

    await car_table.save(car);

    return car;
  }
  return;
}

//------------------------------------------ READ ---------------------------------------------
export async function getAllCars(car_table: Repository<Car>): Promise<Car[]> {
  return await car_table.find();
}

export async function getCar(car_id: number, car_table: Repository<Car>): Promise<Car> {
  return await car_table.findOneBy({id: car_id})
}

//--------------------------------------- DELETE ---------------------------------------------
export async function removeCar(car: Car,car_table: Repository<Car>): Promise<void> {
  await car_table.remove(car);
}

export async function removeCarId(car_id: number,car_table: Repository<Car>): Promise<void> {
  const car = await getCar(car_id, car_table)
  await car_table.remove(car);
}

//--------------------------------------- checks --------------------------------------------
function checkYearKm(year: number, km: number): boolean{
  if(km < 0 || year < 0){
    throw new Error("Invalid Year or Kilometers: Must be non-negative.")
    return false;
  }
  return true;
}
