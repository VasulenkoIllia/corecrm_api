import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleService } from '../prisma/role.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../components/user/user.service';

@Injectable()
export class DbInfrastructure implements OnModuleInit {
  private readonly logger = new Logger(DbInfrastructure.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initialize();
  }

  async initialize(): Promise<void> {
    await this.checkDbConnection();
    await this.initRoles();
    await this.initDefaultAdminAccount();
  }

  private async checkDbConnection(): Promise<void> {
    let retries = 3;
    const retryDelay = 2000;

    while (retries > 0) {
      try {
        await this.prisma.$connect();
        this.logger.log('Database connection established successfully.');
        return;
      } catch (error) {
        retries--;
        this.logger.warn(
          `Failed to connect to the database: ${error.message}. Retries left: ${retries}`,
        );
        if (retries === 0) {
          this.logger.error('Unable to connect to the database after retries.');
          process.exit(1);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  private async initRoles(): Promise<void> {
    try {
      const existingRoles = await this.roleService.getAllRoles();
      if (existingRoles.length === 0) {
        await this.roleService.createInitialRoles();
        this.logger.log('Initial roles have been created successfully.');
      } else {
        this.logger.log('Roles already exist, skipping initialization.');
      }
    } catch (error) {
      this.logger.error(`Failed to initialize roles: ${error.message}`);
      throw error;
    }
  }

  private async initDefaultAdminAccount(): Promise<void> {
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'admin@example.com');
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'securePassword123');
      const adminExists = await this.userService.checkUserExists(adminEmail);

      if (!adminExists) {
        await this.userService.createAdminUser(adminEmail, adminPassword);
        this.logger.log('Default admin account has been created successfully.');
      } else {
        this.logger.log('Admin account already exists, skipping initialization.');
      }
    } catch (error) {
      this.logger.error(`Failed to create default admin account: ${error.message}`);
      throw error;
    }
  }
}
