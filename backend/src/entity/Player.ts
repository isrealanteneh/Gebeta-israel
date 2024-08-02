import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // firstName: string

  // @Column()
  // lastName: string

  @Column()
  username: string;

  @Column()
  password: string;
}
