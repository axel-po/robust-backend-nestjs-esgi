import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private client!: postgres.Sql;
  db!: ReturnType<typeof drizzle<typeof schema>>;

  onModuleInit() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not defined');

    this.client = postgres(url);
    this.db = drizzle(this.client, { schema });
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.client.end();
    this.logger.log('Database disconnected');
  }
}
