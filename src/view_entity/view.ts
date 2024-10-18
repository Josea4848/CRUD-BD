import { ViewEntity, ViewColumn } from "typeorm";
import { DataSource } from "typeorm";
import { Car } from "../entity/Car";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("Car.model", "model")
      .addSelect("Car.year", "year")
      .addSelect("Car.brand", "brand")
      .addSelect("Car.km", "km")
      .addSelect("Car.sold", "sold")
      .from(Car, "Car"),
})
export class CarView {
  @ViewColumn()
  model: string;

  @ViewColumn()
  year: number;

  @ViewColumn()
  brand: string;

  @ViewColumn()
  km: number;

  @ViewColumn()
  sold: boolean;
}
