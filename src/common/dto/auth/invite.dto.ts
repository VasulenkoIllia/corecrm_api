import { IsEmail, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteDTO {
  @ApiProperty({ example: 'jane.doe@example.com', description: 'Email address of the employee to invite' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 2, description: 'ID of the company to invite the employee to' })
  @IsInt()
  @Min(1)
  companyId: number;
}
