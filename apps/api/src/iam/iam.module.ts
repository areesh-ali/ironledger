import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { DatabaseModule } from '../database/database.module';
import { HashService } from '../common/HashingService/hashing.service';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [DatabaseModule],
  controllers: [IamController],
  providers: [IamService,HashService],
})
export class IamModule {}
