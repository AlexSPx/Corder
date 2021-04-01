import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("team")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  creator_id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  displayname: string;

  @Column("jsonb", { nullable: false })
  description: description[];

  @Column("text", { array: true })
  members: string[];

  @Column("text", { array: true })
  admins: string[];

  @Column("bytea", { nullable: true })
  image: Buffer | null;
}

interface description {
  company?: string;
  desc: string;
}
