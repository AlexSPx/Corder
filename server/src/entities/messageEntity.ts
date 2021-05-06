import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  type: "text" | "image";

  @Column("text", { nullable: false })
  message: string | Blob;

  @Column("text", { nullable: false })
  userid: string;

  @Column("text", { nullable: false })
  roomid: string;

  @Column("bigint", { nullable: false })
  sentat: number;
}
