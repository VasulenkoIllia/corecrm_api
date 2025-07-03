import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleToUserDto {
  @ApiProperty({ example: 1, description: 'ID of the company' })
  @IsInt()
  companyId: number;

  @ApiProperty({ example: 1, description: 'ID of the role' })
  @IsInt()
  roleId: number;

  @ApiProperty({ example: 1, description: 'ID of the user' })
  @IsInt()
  userId: number;
}
