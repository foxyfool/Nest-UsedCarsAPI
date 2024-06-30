import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])], // this is how we import the TypeOrmModule and specify which entities we want to include in the database
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
