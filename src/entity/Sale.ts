import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "./Car";
import { Client } from "./Client";

@Entity()
export class Sale {

  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => Car, car => car.id)
  @JoinColumn()
  car: Car

  @OneToOne(type => Client, client => client.CPF)
  @JoinColumn()
  client: Client

  @Column({
    type: "money",
    nullable: false
  })
  price: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  constructor(client: Client, car: Car, price: number){
    this.client = client;
    this.car = car;
    this.price = price;
  }
}
