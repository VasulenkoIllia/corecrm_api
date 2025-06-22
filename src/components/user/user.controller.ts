import { Controller, Logger, NotFoundException, Req, RequestMethod } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { UserMeResponseDto } from '../../common/dto/user/user-me-response.dto'; // Додано

/**
 * Контролер для роботи з користувачами
 * Обробляє HTTP запити пов'язані з даними користувачів
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @SecureEndpoint('me', RequestMethod.GET)
  @ApiOkResponse({ type: UserMeResponseDto }) // Оновлено тип відповіді
  @CatchError('Fetching user data')
  async getMe(@Req() req: IAuthorizedRequest): Promise<UserMeResponseDto> {
    this.logger.log(`Fetching user data for user ${req.user.id}`);
    const user = await this.userService.findById(req.user.id);

    if (!user) {
      this.logger.warn(`User with ID ${req.user.id} not found`);
      throw new NotFoundException('User not found');
    }

    const companies = user.companyUsers.map(cu => ({
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
