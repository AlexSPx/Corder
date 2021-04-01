import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 40, nullable: false })
  username: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column("bytea", { nullable: true })
  avatar: Buffer | null;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isActivated: boolean;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
