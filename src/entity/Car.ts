import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum Service {
  Rent = 0,
  Sale = 1,
}

@Entity()
export class Car {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    type: "int",
    default: new Date().getFullYear(),
  })
  year: number;

  @Column({
    type: "varchar",
    length: 30,
  })
  model: string;

  @Column({
    type: "varchar",
    length: 30,
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
  })
  service: Service;
}
