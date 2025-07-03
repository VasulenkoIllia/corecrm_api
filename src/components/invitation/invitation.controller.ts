import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { Public } from '../auth/guards/public.guard';
import { InvitationService } from './invitation.service';
import { InviteDTO } from '../../common/dto/auth/invite.dto';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { InvitationResponseDto } from '../../common/dto/auth/invitation-response.dto'; // Припускаю, що такий DTO існує

// Константи для модуля та дій
const MODULE_NAME = 'invitation';
const ACTIONS = {
  CREATE: 'create' as const,
};

/**
 * Контролер для управління запрошеннями
 */
@ApiTags('Invitation')
@Controller('invitation')
export class InvitationController {
  private readonly logger = new Logger(InvitationController.name);

  constructor(private readonly invitationService: InvitationService) {}

  /**
   * Створює посилання для запрошення співробітника
   */
  @Post('invite')
  @AccessControlEndpoint('invite', { module: MODULE_NAME, action: ACTIONS.CREATE, requiredRole: 'director' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invitation link for employee' })
  @ApiOkResponse({
    status: 201,
    description: 'Invitation created successfully',
    type: class InviteResponseDto {
      message: string;
      token: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({
    type: InviteDTO,
    examples: {
      example1: {
        summary: 'Example of creating an invitation',
        value: {
          email: 'employee@example.com',
          role: 'employee',
        },
      },
    },
  })
  @CatchError('Creating invitation')
  async createInvite(@Body() inviteDto: InviteDTO, @Req() req: IAuthorizedRequest) {
    this.logger.log({
      message: 'Creating invitation',
      userId: req.user.id,
      method: 'createInvite',
    });
    return this.invitationService.createInvite(inviteDto, req.user.id);
  }

  /**
   * Перевіряє токен запрошення
   */
  @Public()
  @Get(':token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate invitation token' })
  @ApiOkResponse({
    status: 200,
    description: 'Invitation details retrieved successfully',
    type: InvitationResponseDto, // Припускаю, що DTO існує
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  @ApiParam({ name: 'token', description: 'Invitation token', type: String })
  @CatchError('Validating invitation token')
  async validateInvite(@Param('token') token: string) {
    this.logger.log({
      message: 'Validating invitation token',
      method: 'validateInvite',
    });
    return this.invitationService.validateInviteToken(token);
  }
}
