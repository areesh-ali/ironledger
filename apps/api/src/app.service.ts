import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'IRONLEDGER ONLINE';
  }
//TODO: integrate complete health check
  getHealth() {
    return {
      'apiversion': "1",
      "status": "online",
      "healthy": true
    }
  }
}
