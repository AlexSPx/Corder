import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("assignments")
export class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { array: true, nullable: false })
  teamID: string[];

  @Column("text", { nullable: false })
  projectID: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column("text", { array: true, nullable: true })
  range: string[] | null;

  @Column("text", { array: true, nullable: false })
  members: string[];

  @Column("text", { array: true })
  admins: string[];

  @Column("text", { array: true, nullable: true })
  submits: string[] | null;

  @Column("text", { array: true, nullable: true })
  files: string[] | null;

  @Column("text", { nullable: false })
  description: string;

  @Column("text", { nullable: true })
  type: "group" | "foreach";
}
