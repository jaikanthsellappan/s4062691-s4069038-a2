import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;
}