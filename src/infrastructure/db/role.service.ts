import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.prisma.role.findMany();
      this.logger.log(`Retrieved ${roles.length} roles from the database.`);
      return roles;
    } catch (error) {
      this.logger.error(`Failed to retrieve roles: ${error.message}`);
      throw error;
    }
  }

  async createInitialRoles(): Promise<void> {
    try {
      const defaultRoles = [
        { name: 'superadmin', description: 'Super administrator with full access' },
        { name: 'director', description: 'Director with management permissions' },
        { name: 'employee', description: 'Employee with limited permissions' },
      ];

      for (const role of defaultRoles) {
        const existingRole = await this.prisma.role.findUnique({
          where: { name: role.name },
        });

        if (!existingRole) {
          await this.prisma.role.create({
            data: {
              name: role.name,
              description: role.description,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          this.logger.log(`Created role: ${role.name}`);
        } else {
          this.logger.log(`Role ${role.name} already exists, skipping creation.`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to create initial roles: ${error.message}`);
      throw error;
    }
  }

  async createRole(name: string, description?: string): Promise<Role> {
    try {
      const role = await this.prisma.role.create({
        data: {
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      this.logger.log(`Created new role: ${name}`);
      return role;
    } catch (error) {
      this.logger.error(`Failed to create role ${name}: ${error.message}`);
      throw error;
    }
  }

  async deleteRole(name: string): Promise<void> {
    try {
      await this.prisma.role.delete({
        where: { name },
      });
      this.logger.log(`Deleted role: ${name}`);
    } catch (error) {
      this.logger.error(`Failed to delete role ${name}: ${error.message}`);
      throw error;
    }
  }
}
