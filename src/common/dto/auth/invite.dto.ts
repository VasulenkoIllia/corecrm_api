import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt } from 'class-validator';

export class InviteDTO {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @IsInt()
  companyId: number;
}
