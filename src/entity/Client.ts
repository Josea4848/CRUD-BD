import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Client {

    @PrimaryColumn({
        type: "char",
        length: 11,
        unique: true
    })
    CPF: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    age: number

}
