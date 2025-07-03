import { Controller, Get, HttpCode, HttpStatus, Logger, NotFoundException, Req } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { UserService } from './user.service';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { UserMeResponseDto } from '../../common/dto/user/user-me-response.dto';

// Константи для модуля та дій
const MODULE_NAME = 'user';
const ACTIONS = {
  READ: 'read' as const,
};

/**
 * Контролер для управління даними користувачів
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Отримує дані поточного користувача
   */
  @Get('me')
  @AccessControlEndpoint('me', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user data' })
  @ApiOkResponse({
    status: 200,
    description: 'User data retrieved successfully',
    type: UserMeResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @CatchError('Fetching user data')
  async getMe(@Req() req: IAuthorizedRequest): Promise<UserMeResponseDto> {
    this.logger.log({
      message: 'Fetching user data',
      userId: req.user.id,
      method: 'getMe',
    });
    const user = await this.userService.findById(req.user.id);

    if (!user) {
      this.logger.warn({
        message: 'User not found',
        userId: req.user.id,
        method: 'getMe',
      });
      throw new NotFoundException('User not found');
    }

    const companies = user.companyUsers.map((cu) => ({
      id: cu.company.id,
      name: cu.company.name,
      status: cu.company.status,
    }));

    const companyRoles = await this.userService.getUserRoles(req.user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name ?? 'employee',
      companies,
      companyRoles,
    };
  }
}

