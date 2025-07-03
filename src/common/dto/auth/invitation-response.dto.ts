import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty({ example: 'jane.doe@example.com', description: 'Email address of the invited employee' })
  email: string;

  @ApiProperty({ example: { id: 2, name: 'Example Corp' }, description: 'Details of the company' })
  company: { id: number; name: string };
}
