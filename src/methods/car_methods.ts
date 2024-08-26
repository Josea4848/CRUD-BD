import { ILike, Repository } from "typeorm";
import { Car } from "../entity/Car";

export class Car_Manager{
  //----------------------------------------- CREATE ---------------------------------------------
  public async add(year: number, model: string, brand: string, km: number, car_table: Repository<Car>): Promise<Car> {

  if (checkYearKm(year, km)){
    const car = new Car(year, model, brand, km);

    await car_table.save(car);

    return car;
  }
  return null;
  }

  //------------------------------------------ READ ---------------------------------------------
  public async getAll(car_table: Repository<Car>): Promise<Car[]> {
  return await car_table.find();
  }

  public async getOne(car_id: number, car_table: Repository<Car>): Promise<Car> {
  return await car_table.findOneBy({id: car_id})
  }

  public async getAvailable(car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({sold: false})
  }

  public async getSold(car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({sold: true})
  }

  public async getByBrand(brand: string, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ brand: ILike(`%${brand}%`) })
  }

  public async getByYear(year: number, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ year: year })
  }

  public async getModel(model: string, car_table: Repository<Car>): Promise<Car[]>{
  return await car_table.findBy({ model: ILike(`%${model}%`) })
  }

  //--------------------------------------- UPDATE ---------------------------------------------
  public async updateModel(car_id: number, new_model: string, car_table: Repository<Car>): Promise<void> {
  if(new_model == null){
    throw new Error("Trying to update car model to null")
  }else{
    await car_table.update(car_id, {model: new_model})
  }
  }

  public async updateBrand(car_id: number, new_brand: string, car_table: Repository<Car>): Promise<void> {
  if(new_brand == null){
    throw new Error("Trying to update car brand to null")
  }else{
    await car_table.update(car_id, {brand: new_brand})
  }
  }

  public async updateKm(car_id: number, new_km: number, car_table: Repository<Car>): Promise<void> {
  if(new_km == null){
    throw new Error("Trying to update car kilometers to null")
  }else{
    await car_table.update(car_id, {km: new_km})
  }
  }

  public async updateYear(car_id: number, new_year: number, car_table: Repository<Car>): Promise<void> {
  if(new_year == null){
    throw new Error("Trying to update car year to null")
  }else{
    await car_table.update(car_id, {year: new_year})
  }
  }
  //--------------------------------------- DELETE ---------------------------------------------
  public async remove(car: Car,car_table: Repository<Car>): Promise<void> {
  await car_table.remove(car);
  }

  public async removeId(car_id: number,car_table: Repository<Car>): Promise<void> {
  const car = await this.getOne(car_id, car_table)
  await car_table.remove(car);
  }
}

//--------------------------------------- checks --------------------------------------------
function checkYearKm(year: number, km: number): boolean{
  if(km < 0 || year < 0){
    throw new Error("Invalid Year or Kilometers: Must be non-negative.")
    return false;
  }
  return true;
}
