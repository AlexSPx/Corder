import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("files")
export class Files {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  teamID: string;

  @Column("text", { nullable: false })
  file: string;

  @Column("text", { nullable: false })
  name: string;

  @Column("text", { array: true, nullable: true })
  members: string[];

  @Column({ nullable: false })
  type: "html" | "document" | "link" | "docx";
}
