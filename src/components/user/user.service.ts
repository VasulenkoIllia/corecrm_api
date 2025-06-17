import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmailForAuth(email: string) {
    return this.prisma.client.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findCompanyUser(userId: number) {
    const companyUser = await this.prisma.client.companyUsers.findFirst({
      where: { userId },
    });
    if (!companyUser) {
      throw new NotFoundException('User not associated with any company');
    }
    return companyUser;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async createAdminUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await this.prisma.client.role.findUnique({
      where: { name: 'superadmin' },
    });

    if (!role) {
      throw new NotFoundException('Role superadmin not found');
    }

    return this.prisma.client.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
