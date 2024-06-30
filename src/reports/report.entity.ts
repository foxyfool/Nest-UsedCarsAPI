import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'; // these are decorators that help us define the schema of our database table
import { User } from '../users/user.entity';

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

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
