import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("projects")
export class Projects {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  displayname: string;

  @Column({ nullable: true })
  desc: string;

  @Column("text", { array: true })
  members: string[];

  @Column("text", { array: true })
  admins: string[];

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column("text", { array: true, nullable: true })
  range: string[];

  @Column("text", { array: true, nullable: false })
  teamID: string[];
}
