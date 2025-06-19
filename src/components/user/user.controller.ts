import { Controller, Logger, NotFoundException, Req, RequestMethod } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { UserResponseDTO } from '../../common/dto/user/user.response.dto';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';


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
  @CatchError('Fetching user data')
  async getMe(@Req() req: IAuthorizedRequest): Promise<{ id: any; email: any; role: string; }> {
    const user = await this.userService.findById(req.user.id);

    if (!user) {
      this.logger.warn(`User with ID ${req.user.id} not found`);
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role?.name ?? 'employee',
    };
  }
}
