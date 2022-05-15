import { User } from '../users/user.entity';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne((type) => User, (user) => user.reports)
  user: User;

  @AfterInsert()
  logInsert() {
    console.log(`Report Inserted ${this.id}`);
  }
}
