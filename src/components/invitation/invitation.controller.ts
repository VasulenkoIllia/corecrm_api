import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Req, RequestMethod } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvitationService } from './invitation.service';
import { InviteDTO } from '../../common/dto/auth/invite.dto';
import { Public } from '../auth/guards/public.guard';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { CatchError } from '../../common/decorators/catch-error.decorator';

@ApiTags('Invitation')
@Controller('invitation')
export class InvitationController {
  private readonly logger = new Logger(InvitationController.name);

  constructor(private readonly invitationService: InvitationService) {}

  @AccessControlEndpoint('invite', { requiredRole: 'director' }, RequestMethod.POST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an invitation link for an employee' })
  @ApiOkResponse({ status: 201, description: 'Invitation created', schema: { properties: { message: { type: 'string' }, token: { type: 'string' } } } })
  @ApiBody({type: InviteDTO})
  @CatchError('Creating invitation')
  async createInvite(@Body() inviteDto: InviteDTO, @Req() req: IAuthorizedRequest) {
    return this.invitationService.createInvite(inviteDto, req.user.id);
  }

  @Public()
  @Get(':token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate an invitation token' })
  @ApiOkResponse({ status: 200, description: 'Returns invitation details', schema: { properties: { email: { type: 'string' }, company: { type: 'object' } } } })
  @ApiBody({})
  @CatchError('Validating invitation token')
  async validateInvite(@Param('token') token: string) {
    return this.invitationService.validateInviteToken(token);
  }
}