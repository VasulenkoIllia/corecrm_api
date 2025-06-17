import { Controller, Logger, Req, RequestMethod } from '@nestjs/common';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { UserService } from './user.service';
import { UserResponseDTO } from '../../common/dto/user/user.response.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiOkResponse({ type: UserResponseDTO })
  async getMe(@Req() req: IAuthorizedRequest): Promise<UserResponseDTO> {
    try {
      this.logger.log(`Fetching user data for ID: ${req.user.id}`);
      const user = await this.userService.findById(req.user.id);

      if (!user) {
        this.logger.warn(`User with ID ${req.user.id} not found`);
        throw new Error('User not found');
      }

      this.logger.log(`User data retrieved successfully for ID: ${req.user.id}`);

      return {
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'employee',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch user data for ID ${req.user.id}: ${error.message}`);
      throw error;
    }
  }
}
