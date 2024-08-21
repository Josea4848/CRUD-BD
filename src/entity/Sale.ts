import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  ID: number;
}
