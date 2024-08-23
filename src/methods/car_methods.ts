import { ILike, Repository } from "typeorm";
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

export async function getAvailableCars(car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({sold: false})
}

export async function getSoldCars(car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({sold: true})
}

export async function getCarsBrand(brand: string, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ brand: ILike('%{brand}%') })
}

export async function getCarsYear(year: number, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ year: year })
}

export async function getCarsModel(model: string, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ model: ILike('%{model}%') })
}

//--------------------------------------- UPDATE ---------------------------------------------
export async function updateCarModel(car_id: number, new_model: string, car_table: Repository<Car>): Promise<void> {
  if(new_model == null){
    throw new Error("Trying to update car model to null")
  }else{
    await car_table.update(car_id, {model: new_model})
  }
}

export async function updateCarBrand(car_id: number, new_brand: string, car_table: Repository<Car>): Promise<void> {
  if(new_brand == null){
    throw new Error("Trying to update car brand to null")
  }else{
    await car_table.update(car_id, {brand: new_brand})
  }
}

export async function updateCarKm(car_id: number, new_km: number, car_table: Repository<Car>): Promise<void> {
  if(new_km == null){
    throw new Error("Trying to update car kilometers to null")
  }else{
    await car_table.update(car_id, {km: new_km})
  }
}

export async function updateCarYear(car_id: number, new_year: number, car_table: Repository<Car>): Promise<void> {
  if(new_year == null){
    throw new Error("Trying to update car year to null")
  }else{
    await car_table.update(car_id, {year: new_year})
  }
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
