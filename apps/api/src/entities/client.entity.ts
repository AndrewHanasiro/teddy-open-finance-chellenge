import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'public_id' })
  publicId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  salary!: number;

  @Column()
  valuation!: number;

  @CreateDateColumn()
  created_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}
