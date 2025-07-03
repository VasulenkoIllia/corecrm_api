import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDTO {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address to send the reset link to' })
  @IsEmail()
  email: string;
}
