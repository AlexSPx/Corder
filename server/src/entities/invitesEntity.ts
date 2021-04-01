import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("invites")
export class Invites {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  userID: string;

  @Column({ nullable: false })
  teamID: string;

  @Column({ nullable: false, default: false })
  status: boolean;
}
