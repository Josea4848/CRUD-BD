import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Service {
  RENT = 0,
  SALE = 1,
}

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
    type: "enum",
    enum: Service,
    nullable: false
  })
  service: Service;

  @Column({
    type: "boolean",
    default: false
  })
  on_service: boolean;

  constructor(
    year: number,
    model: string,
    brand: string,
    km: number,
    service: Service,
  ) {
    this.model = model;
    this.brand = brand;
    this.year = year;
    this.km = km;
    this.service = service;
  }
}
