import { Module } from '@nestjs/common';
import { OrgnizationService } from './orgnization.service.js';
import { OrgnizationController } from './orgnization.controller.js';

@Module({
  controllers: [OrgnizationController],
  providers: [OrgnizationService],
})
export class OrgnizationModule {}
