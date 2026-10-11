import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { OrgnizationModule } from './orgnization/orgnization.module';
import { MembershipModule } from './membership/membership.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [IamModule, OrgnizationModule, MembershipModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
