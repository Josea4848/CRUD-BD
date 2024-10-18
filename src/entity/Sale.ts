import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Car } from "./Car";
import { Client } from "./Client";
import { Seller } from "./seller";

@Entity()
export class Sale {
  @PrimaryColumn({
    nullable: false,
    unique: true,
  })
  id: number;

  @OneToOne((type) => Car, (car) => car.id, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn()
  car: Car;

  @ManyToOne((type) => Client, (client) => client.CPF, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client: Client;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  date: string;

  @Column({ type: "time", default: () => "CURRENT_TIME" })
  time: string;

  @ManyToOne((type) => Seller, (seller) => seller.CPF, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn()
  seller: Seller;

  @BeforeInsert()
  @BeforeUpdate()
  validatePrice() {
    if (this.price < 0) {
      throw new Error("Invalid Price: Must be non-negative.");
    }
  }
  constructor(id: number, client: Client, car: Car, value: number) {
    this.id = id;
    this.client = client;
    this.car = car;
    this.price = value;
  }
}
