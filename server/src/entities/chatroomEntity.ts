import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("chatroom")
export class Chatroom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { array: true, nullable: false })
  teamID: string[];

  @Column("text", { nullable: false })
  name: string;

  @Column("bytea", { nullable: true })
  image: Buffer | null;

  @Column("text", { array: true, nullable: false })
  members: string;

  @Column("text", { array: true, nullable: false })
  admins: string;
}
