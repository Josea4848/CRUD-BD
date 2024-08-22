import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Car } from "./Car";
import { Client } from "./Client";

@Entity()
export class Sale {

  @PrimaryColumn({
    nullable: false,
    unique: true
  })
  id: number

  @OneToOne(type => Car, car => car.id, {onDelete: "RESTRICT"})
  @JoinColumn()
  car: Car

  @ManyToOne(type => Client, client => client.CPF,{onDelete: "CASCADE"})
  @JoinColumn()
  client: Client

  @Column({
    type: "decimal",
    precision: 10, scale: 2,
    nullable: false
  })
  price: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  constructor(id: number, client: Client, car: Car, value: number){
    this.id = id;
    this.client = client;
    this.car = car;
    this.price = value;
  }
}
