import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("AssignmentsCollector")
export class AssignmentsCollector {
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

  @Column("text", { nullable: true })
  description: string;

  @Column("text", { array: true, nullable: false })
  admins: string[];

  @Column("text", { array: true, nullable: false })
  assignments: string[];
}
