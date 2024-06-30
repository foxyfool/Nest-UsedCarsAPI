import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BeforeRemove,
  OneToMany,
} from 'typeorm'; // these are decorators that help us define the schema of our database table
import { Report } from '../reports/report.entity';

// circular dependency : User imports Report and Report imports User

@Entity() // table name will be the same as the class name , creates a new table in the database named User
export class User {
  @PrimaryGeneratedColumn() // creates a new column in the table that will be the primary key
  id: number;
  @Column() // creates a new column in the table that will be a varchar named email
  email: string;
  @Column() // creates a new column in the table that will be a varchar named password
  password: string;

  @Column({ default: true }) // creates a new column in the table that will be a boolean named admin
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  private tempId: number;

  @BeforeRemove()
  storeBeforeRemove() {
    this.tempId = this.id;
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.tempId);
  }
}

// hooks in typeorm
