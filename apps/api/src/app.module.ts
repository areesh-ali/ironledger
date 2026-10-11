import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { IamModule } from './iam/iam.module.js';
import { OrgnizationModule } from './orgnization/orgnization.module.js';
import { MembershipModule } from './membership/membership.module.js';

@Module({
  imports: [IamModule, OrgnizationModule, MembershipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
