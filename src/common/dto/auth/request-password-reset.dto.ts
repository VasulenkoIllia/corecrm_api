import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestPasswordResetDTO {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;
}