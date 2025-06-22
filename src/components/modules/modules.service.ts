import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { UpdateModulesDto } from '../../common/dto/module/modules.dto';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    private prisma: PrismaService,
    private accessControlService: AccessControlService,
  ) {}

  async createModule(name: string, description?: string) {
    this.logger.log(`Creating module ${name}`);
    return this.prisma.module.create({
      data: {
        name,
        description,
      },
    });
  }

  async getAllModules() {
    this.logger.log(`Fetching all modules`);
    return this.prisma.module.findMany();
  }

  async activateModule(companyId: number, moduleName: string, userId: number) {
    this.logger.log(`Activating module ${moduleName} for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const module = await this.prisma.module.findUnique({
      where: { name: moduleName },
    });
    if (!module) {
      this.logger.warn(`Module ${moduleName} not found`);
      throw new NotFoundException(`Module ${moduleName} not found`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const existingModule = await this.prisma.companyModules.findFirst({
      where: { companyId, moduleId: module.id },
    });
    if (existingModule) {
      this.logger.warn(`Module ${moduleName} already activated for company ${companyId}`);
      throw new ForbiddenException(`Module ${moduleName} already activated`);
    }

    const companyModule = await this.prisma.companyModules.create({
      data: {
        companyId,
        moduleId: module.id,
      },
    });

    this.logger.log(`Module ${moduleName} activated for company ${companyId}`);
    return { message: `Module ${moduleName} activated`, data: companyModule };
  }

  async getModules(companyId: number, userId: number) {
    this.logger.log(`Fetching modules for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, {});

    const companyModules = await this.prisma.companyModules.findMany({
      where: { companyId },
      include: { module: true },
    });

    const modules = companyModules.reduce((acc, cm) => {
      acc[cm.module.name] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    return { data: modules };
  }

  async updateModules(companyId: number, modulesDto: UpdateModulesDto, userId: number) {
    this.logger.log(`Updating modules for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    // Перевіряємо модулі
    const moduleNames = Object.keys(modulesDto);
    const modules = await this.prisma.module.findMany({
      where: { name: { in: moduleNames } },
    });
    const invalidModules = moduleNames.filter(name => !modules.some(m => m.name === name));
    if (invalidModules.length > 0) {
      this.logger.warn(`Invalid module names: ${invalidModules.join(', ')}`);
      throw new ForbiddenException(`Invalid module names: ${invalidModules.join(', ')}`);
    }

    // Очищаємо поточні модулі компанії
    await this.prisma.companyModules.deleteMany({
      where: { companyId },
    });

    // Додаємо нові модулі
    const modulePromises = moduleNames
      .filter(name => modulesDto[name])
      .map(async name => {
        const module = modules.find(m => m.name === name);
        return this.prisma.companyModules.create({
          data: {
            companyId,
            moduleId: module!.id,
          },
        });
      });

    await Promise.all(modulePromises);

    const updatedModules = await this.prisma.companyModules.findMany({
      where: { companyId },
      include: { module: true },
    });

    const moduleMap = updatedModules.reduce((acc, cm) => {
      acc[cm.module.name] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    this.logger.log(`Modules updated for company ${companyId}`);
    return { message: 'Modules updated', data: moduleMap };
  }

  async deactivateModule(companyId: number, moduleName: string, userId: number) {
    this.logger.log(`Deactivating module ${moduleName} for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const module = await this.prisma.module.findUnique({
      where: { name: moduleName },
    });
    if (!module) {
      this.logger.warn(`Module ${moduleName} not found`);
      throw new NotFoundException(`Module ${moduleName} not found`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const companyModule = await this.prisma.companyModules.findFirst({
      where: { companyId, moduleId: module.id },
    });
    if (!companyModule) {
      this.logger.warn(`Module ${moduleName} not activated for company ${companyId}`);
      throw new ForbiddenException(`Module ${moduleName} not activated`);
    }

    await this.prisma.companyModules.delete({
      where: { id: companyModule.id },
    });

    this.logger.log(`Module ${moduleName} deactivated for company ${companyId}`);
    return { message: `Module ${moduleName} deactivated`, data: {} };
  }
}
