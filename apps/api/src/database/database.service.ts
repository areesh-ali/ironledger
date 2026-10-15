import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {

  private readonly pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    max: 10,
  });

  readonly db = drizzle({ client: this.pool });
  
    async onModuleDestroy() {
      await this.pool.end();
    }
}
