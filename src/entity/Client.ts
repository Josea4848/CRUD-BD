import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { Sale } from "./Sale"
@Entity()
export class Client {

    @PrimaryColumn({
        type: "char",
        length: 11,
        unique: true,
        nullable: false
    })
    CPF: string

    @Column({
      type: "varchar",
      length: 30,
      nullable: false
    })
    first_name: string

    @Column({
      type: "varchar",
      length: 30,
      nullable: false
    })
    last_name: string

    @Column({
      type: "date",
      nullable: false
    })
    birthdate: string

    @OneToMany(type => Sale, sale => sale.client)
    sales: Sale[];

    constructor(CPF: string, first_name: string, last_name: string, birthdate: string){
      this.CPF = CPF;
      this.first_name = first_name;
      this.last_name = last_name;
      this.birthdate = birthdate;
    }
}
