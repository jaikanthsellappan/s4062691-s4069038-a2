import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  availability: string;
}