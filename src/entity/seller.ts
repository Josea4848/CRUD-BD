import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Sale } from "./Sale";
@Entity()
export class Seller {
  @PrimaryColumn({
    type: "char",
    length: 11,
    unique: true,
    nullable: false,
  })
  CPF: string;

  @Column({
    type: "varchar",
    length: 30,
    nullable: false,
  })
  first_name: string;

  @Column({
    type: "varchar",
    length: 30,
    nullable: false,
  })
  last_name: string;

  @Column({
    type: "date",
    nullable: false,
  })
  birthdate: string;

  @Column({
    type: "varchar",
    length: 60, // Ajuste o tamanho conforme necessário
    nullable: false,
    default: "dsjkdjs",
  })
  password: string; // Campo para armazenar a senha hash

  @OneToMany((type) => Sale, (sale) => sale.seller)
  sales: Sale[];

  constructor(
    CPF: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    password: string
  ) {
    this.CPF = CPF;
    this.first_name = first_name;
    this.last_name = last_name;
    this.birthdate = birthdate;
    this.password = password;
  }
}
