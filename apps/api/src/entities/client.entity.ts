import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @CreateDateColumn()
  created_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}