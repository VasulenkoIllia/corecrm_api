import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { UpdateModulesDto } from '../../common/dto/module/modules.dto';


interface Modules {
  [key: string]: boolean;
}

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    private prisma: PrismaService,
    private accessControlService: AccessControlService,
  ) {}

  async activateModule(companyId: number, moduleName: string, userId: number) {
    this.logger.log(`Activating module ${moduleName} for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const validModules = ['clients', 'cars', 'invoices', 'reports'];
    if (!validModules.includes(moduleName)) {
      this.logger.warn(`Invalid module name: ${moduleName}`);
      throw new ForbiddenException(`Module ${moduleName} is not supported`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const modules: Modules = (company.modules as Modules) || {};
    modules[moduleName] = true;

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: { modules: modules as any }, // Явне приведення до any для сумісності з Prisma
    });

    this.logger.log(`Module ${moduleName} activated for company ${companyId}`);
    return { message: `Module ${moduleName} activated`, modules: updatedCompany.modules };
  }

  async getModules(companyId: number, userId: number) {
    this.logger.log(`Fetching modules for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, {});

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    return { data: company.modules };
  }

  async updateModules(companyId: number, modulesDto: UpdateModulesDto, userId: number) {
    this.logger.log(`Updating modules for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const validModules = ['clients', 'cars', 'invoices', 'reports'];
    const invalidModules = Object.keys(modulesDto).filter(key => !validModules.includes(key));
    if (invalidModules.length > 0) {
      this.logger.warn(`Invalid module names: ${invalidModules.join(', ')}`);
      throw new ForbiddenException(`Invalid module names: ${invalidModules.join(', ')}`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: { modules: modulesDto as any }, // Явне приведення до any для сумісності з Prisma
    });

    this.logger.log(`Modules updated for company ${companyId}`);
    return { message: 'Modules updated', data: updatedCompany.modules };
  }

  async deactivateModule(companyId: number, moduleName: string, userId: number) {
    this.logger.log(`Deactivating module ${moduleName} for company ${companyId} by user ${userId}`);

    await this.accessControlService.checkAccess(userId, companyId, { requiredRole: 'director' });

    const validModules = ['clients', 'cars', 'invoices', 'reports'];
    if (!validModules.includes(moduleName)) {
      this.logger.warn(`Invalid module name: ${moduleName}`);
      throw new ForbiddenException(`Module ${moduleName} is not supported`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const modules: Modules = (company.modules as Modules) || {};
    modules[moduleName] = false;

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: { modules: modules as any }, // Явне приведення до any для сумісності з Prisma
    });

    this.logger.log(`Module ${moduleName} deactivated for company ${companyId}`);
    return { message: `Module ${moduleName} deactivated`, data: updatedCompany.modules };
  }
}
