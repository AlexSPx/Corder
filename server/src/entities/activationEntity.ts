import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("activation")
export class Activation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  userID: string;
}
