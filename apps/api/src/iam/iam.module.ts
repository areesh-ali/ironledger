import { Module } from '@nestjs/common';
import { IamService } from './iam.service.js';
import { IamController } from './iam.controller.js';

@Module({
  controllers: [IamController],
  providers: [IamService],
})
export class IamModule {}
