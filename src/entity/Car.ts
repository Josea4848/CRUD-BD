import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    default: new Date().getFullYear(),
  })
  year: number;

  @Column({
    type: "varchar",
    length: 30,
    nullable: false
  })
  model: string;

  @Column({
    type: "varchar",
    length: 30,
    nullable: false
  })
  brand: string;

  @Column({
    type: "int",
    default: 0,
  })
  km: number;

  @Column({
    type: "boolean",
    default: false
  })
  sold: boolean;

  constructor(
    year: number,
    model: string,
    brand: string,
    km: number
  ) {
    this.model = model;
    this.brand = brand;
    this.year = year;
    this.km = km;
  }
}
