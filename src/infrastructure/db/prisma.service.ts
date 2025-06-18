import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  // async clearDatabase() {
  //   try {
  //     await this.client.$executeRaw`TRUNCATE TABLE "Role" CASCADE;`;
  //     await this.client.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
  //     await this.client.$executeRaw`TRUNCATE TABLE "Company" CASCADE;`;
  //     await this.client.$executeRaw`TRUNCATE TABLE "CompanyUsers" CASCADE;`;
  //     this.logger.log('Database cleared successfully.');
  //   } catch (error) {
  //     this.logger.error(`Failed to clear database: ${error.message}`);
  //     throw error;
  //   }
  // }
}
