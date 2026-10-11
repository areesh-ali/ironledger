import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service.js';
import { MembershipController } from './membership.controller.js';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
