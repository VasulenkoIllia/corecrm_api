import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, Min } from 'class-validator';

export class InviteDTO {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'companyId' })
  @IsInt()
  @Min(1)
  companyId: number;
}
