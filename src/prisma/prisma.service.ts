import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

type PrismaLogLevel = 'query' | 'error' | 'info' | 'warn'

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, PrismaLogLevel>
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ]
    });
  }

  async onModuleInit() {
    this.$on('error', (obj: any) => {
      this.logger.error(obj?.message);
    });
    this.$on('warn', (obj: any) => {
      this.logger.warn(obj?.message);
    });
    this.$on('info', (obj: any) => {
      this.logger.debug(obj?.message);
    });
    this.$on('query', (obj: any) => {
      this.logger.log('\n Query: ' + obj.query + '\n Params: ' + obj.params + '\n Duration: ' + obj.duration + 'ms')
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
