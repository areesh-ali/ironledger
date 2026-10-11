import { Module } from '@nestjs/common';
import { OrgnizationService } from './orgnization.service';
import { OrgnizationController } from './orgnization.controller';

@Module({
  controllers: [OrgnizationController],
  providers: [OrgnizationService],
})
export class OrgnizationModule {}
