import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Report } from './src/reports/report.entity';
import * as path from 'path';

const dbPath = process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, dbPath),
  entities: [User, Report],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
  migrationsRun: process.env.NODE_ENV === 'test', // Automatically run migrations in test environment
});

console.log('Database path:', path.resolve(__dirname, dbPath));
