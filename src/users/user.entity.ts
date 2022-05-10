import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User with id: ${this.id}`);
  }

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id: ${this.id}`);
  }
}
