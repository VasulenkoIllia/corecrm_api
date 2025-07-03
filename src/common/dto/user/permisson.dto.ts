import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ example: 'clients', description: 'Module name for permissions' })
  @IsString()
  module: string;

  @ApiProperty({ example: true, description: 'Permission to create data' })
  @IsBoolean()
  create: boolean;

  @ApiProperty({ example: true, description: 'Permission to delete data' })
  @IsBoolean()
  delete: boolean;

  @ApiProperty({ example: true, description: 'Permission to read data' })
  @IsBoolean()
  read: boolean;

  @ApiProperty({ example: true, description: 'Permission to update data' })
  @IsBoolean()
  update: boolean;
}
